import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RequestOtpUseCase } from "../../otp/useCase/requestOtp.useCase";
import type { VerifyOtpUseCase } from "../../otp/useCase/verifyOtp.useCase";
import { getAuthErrorMessage } from "../../shared/authErrorMessage";
import type { CountryIsoType } from "../../shared/country.types";
import { buildE164PhoneNumber, sanitizePhoneDigits } from "../../shared/phoneNumber";
import type { LanguageCodeType } from "../../languageSelection/types/types";
import type { UpsertAuthSessionUseCase } from "../../session/useCase/upsertAuthSession.useCase";
import type {
  OtpVerificationResult,
  OtpVerificationState,
} from "../types/types";
import type { OtpVerificationViewModel } from "./otpVerification.viewModel";
import { translate } from "@/shared/i18n/resources";

const OTP_CODE_LENGTH = 6;

const getNextRemainingSeconds = (resendAvailableAt: number): number => {
  const remainingMs = resendAvailableAt - Date.now();

  if (remainingMs <= 0) {
    return 0;
  }

  return Math.ceil(remainingMs / 1000);
};

type Params = {
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  languageCode: LanguageCodeType;
  isExistingUser: boolean;
  otpReferenceId: string;
  otpExpiresAt: number;
  resendAfterSeconds: number;
  requestOtpUseCase: RequestOtpUseCase;
  verifyOtpUseCase: VerifyOtpUseCase;
  upsertAuthSessionUseCase: UpsertAuthSessionUseCase;
  onVerified: (input: OtpVerificationResult) => void;
  onClose: () => void;
};

export const useOtpVerificationViewModel = (
  params: Params,
): OtpVerificationViewModel => {
  const {
    phoneNumber,
    countryCode,
    countryIso,
    languageCode,
    isExistingUser,
    otpReferenceId,
    otpExpiresAt,
    resendAfterSeconds,
    requestOtpUseCase,
    verifyOtpUseCase,
    upsertAuthSessionUseCase,
    onVerified,
    onClose,
  } = params;

  const isVerifyingRef = useRef(false);
  const isResendingRef = useRef(false);

  const [state, setState] = useState<OtpVerificationState>(() => {
    const resendAvailableAt = Date.now() + Math.max(0, resendAfterSeconds) * 1000;

    return {
      status: Status.Idle,
      otpCode: "",
      phoneNumber: sanitizePhoneDigits(phoneNumber),
      countryCode,
      countryIso,
      languageCode,
      isExistingUser,
      otpReferenceId,
      otpExpiresAt,
      resendAvailableAt,
      secondsUntilResend: getNextRemainingSeconds(resendAvailableAt),
      errorMessage: "",
    };
  });

  const onOtpCodeChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      otpCode: sanitizePhoneDigits(value).slice(0, OTP_CODE_LENGTH),
      errorMessage: "",
    }));
  }, []);

  const onVerifyPress = useCallback(async (): Promise<void> => {
    if (isVerifyingRef.current) {
      return;
    }

    if (state.otpCode.length < OTP_CODE_LENGTH) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("auth.otpVerification.validationCode"),
      }));
      return;
    }

    if (state.otpExpiresAt <= Date.now()) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("errors.auth.otpExpired"),
      }));
      return;
    }

    isVerifyingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const verifyResult = await verifyOtpUseCase.execute({
        otpReferenceId: state.otpReferenceId,
        otpCode: state.otpCode,
        phoneNumber: buildE164PhoneNumber(state.countryCode, state.phoneNumber),
        countryCode: state.countryCode,
        countryIso: state.countryIso,
      });

      if (!verifyResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(verifyResult.error),
        }));
        return;
      }

      const sessionResult = await upsertAuthSessionUseCase.execute({
        accountId: verifyResult.value.accountId,
        phoneNumber: buildE164PhoneNumber(state.countryCode, state.phoneNumber),
        countryCode: state.countryCode,
        countryIso: state.countryIso,
        isVerified: true,
        isLoggedIn: true,
        accessToken: verifyResult.value.accessToken,
        refreshToken: verifyResult.value.refreshToken,
      });

      if (!sessionResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(sessionResult.error),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        errorMessage: "",
      }));

      onVerified({
        accountId: verifyResult.value.accountId,
        isExistingUser: verifyResult.value.isExistingUser || state.isExistingUser,
      });
    } finally {
      isVerifyingRef.current = false;
    }
  }, [
    onVerified,
    state.countryCode,
    state.countryIso,
    state.isExistingUser,
    state.otpCode,
    state.otpExpiresAt,
    state.otpReferenceId,
    state.phoneNumber,
    upsertAuthSessionUseCase,
    verifyOtpUseCase,
  ]);

  const onResendPress = useCallback(async (): Promise<void> => {
    if (isResendingRef.current || state.secondsUntilResend > 0) {
      return;
    }

    isResendingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const requestResult = await requestOtpUseCase.execute({
        phoneNumber: buildE164PhoneNumber(state.countryCode, state.phoneNumber),
        countryCode: state.countryCode,
        countryIso: state.countryIso,
        languageCode: state.languageCode,
      });

      if (!requestResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(requestResult.error),
        }));
        return;
      }

      const resendAvailableAt =
        Date.now() + requestResult.value.resendAfterSeconds * 1000;

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        otpCode: "",
        isExistingUser: requestResult.value.isExistingUser,
        otpReferenceId: requestResult.value.otpReferenceId,
        otpExpiresAt: requestResult.value.expiresAt,
        resendAvailableAt,
        secondsUntilResend: getNextRemainingSeconds(resendAvailableAt),
        errorMessage: "",
      }));
    } finally {
      isResendingRef.current = false;
    }
  }, [
    requestOtpUseCase,
    state.countryCode,
    state.countryIso,
    state.languageCode,
    state.phoneNumber,
    state.secondsUntilResend,
  ]);

  const onClosePress = useCallback((): void => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setState((currentState) => {
        const nextSeconds = getNextRemainingSeconds(
          currentState.resendAvailableAt,
        );

        if (nextSeconds === currentState.secondsUntilResend) {
          return currentState;
        }

        return {
          ...currentState,
          secondsUntilResend: nextSeconds,
        };
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return {
    state,
    onOtpCodeChange,
    onVerifyPress,
    onResendPress,
    onClosePress,
  };
};
