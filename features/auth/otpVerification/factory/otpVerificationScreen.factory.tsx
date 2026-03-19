import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { isSupportedLanguageCode } from "@/shared/i18n/resources";
import type { LanguageCodeType } from "../../languageSelection/types/types";
import { createLocalOtpRequestDataSource } from "../../otp/data/dataSource/localOtpRequest.dataSource.impl";
import { createRemoteOtpAuthDataSource } from "../../otp/data/dataSource/remoteOtpAuth.dataSource.impl";
import { createOtpRepository } from "../../otp/data/repository/otp.repository.impl";
import { createRequestOtpUseCase } from "../../otp/useCase/requestOtp.useCase.impl";
import { createVerifyOtpUseCase } from "../../otp/useCase/verifyOtp.useCase.impl";
import {
  CountryIso,
  isCountryIso,
  type CountryIsoType,
} from "../../shared/country.types";
import { createLocalAuthSessionDataSource } from "../../session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "../../session/data/repository/authSession.repository.impl";
import { createUpsertAuthSessionUseCase } from "../../session/useCase/upsertAuthSession.useCase.impl";
import type { OtpVerificationResult } from "../types/types";
import OtpVerificationScreen from "../ui/OtpVerificationScreen";
import { useOtpVerificationViewModel } from "../viewModel/otpVerification.viewModel.impl";

const DEFAULT_OTP_EXPIRES_AFTER_MS = 5 * 60 * 1000;

type RawRouteParams = {
  phoneNumber?: string | string[];
  countryIso?: string | string[];
  countryCode?: string | string[];
  languageCode?: string | string[];
  isExistingUser?: string | string[];
  otpReferenceId?: string | string[];
  otpExpiresAt?: string | string[];
  resendAfterSeconds?: string | string[];
};

type CreateOtpVerificationScreenParams = {
  database: Database;
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  languageCode: LanguageCodeType;
  isExistingUser: boolean;
  otpReferenceId: string;
  otpExpiresAt: number;
  resendAfterSeconds: number;
  onVerified(input: OtpVerificationResult): void;
  onClose(): void;
};

type Params = {
  database: Database;
  routeParams: RawRouteParams;
  onVerifiedExistingUser(): void;
  onVerifiedNewUser(accountId: string): void;
  onInvalidRoute(): React.JSX.Element;
  onClose(): void;
};

const readStringParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }

  return typeof value === "string" ? value : "";
};

const parsePositiveNumber = (value: string, fallbackValue: number): number => {
  if (!value) {
    return fallbackValue;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallbackValue;
  }

  return parsedValue;
};

const parseLanguageCode = (value: string): LanguageCodeType => {
  if (value && isSupportedLanguageCode(value)) {
    return value;
  }

  return "en";
};

const parseBoolean = (value: string, fallbackValue: boolean): boolean => {
  if (!value) {
    return fallbackValue;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  return fallbackValue;
};

const getDefaultCountryCode = (countryIso: CountryIsoType): string => {
  return countryIso === CountryIso.India ? "+91" : "+977";
};

const createOtpVerificationScreen = ({
  database,
  phoneNumber,
  countryCode,
  countryIso,
  languageCode,
  isExistingUser,
  otpReferenceId,
  otpExpiresAt,
  resendAfterSeconds,
  onVerified,
  onClose,
}: CreateOtpVerificationScreenParams): React.ComponentType => {
  return function OtpVerificationScreenFactory(): React.JSX.Element {
    const otpRepository = React.useMemo(() => {
      const remoteOtpAuthDataSource = createRemoteOtpAuthDataSource();
      const localOtpRequestDataSource = createLocalOtpRequestDataSource(database);

      return createOtpRepository(remoteOtpAuthDataSource, localOtpRequestDataSource);
    }, []);

    const requestOtpUseCase = React.useMemo(
      () => createRequestOtpUseCase(otpRepository),
      [otpRepository],
    );

    const verifyOtpUseCase = React.useMemo(
      () => createVerifyOtpUseCase(otpRepository),
      [otpRepository],
    );

    const authSessionRepository = React.useMemo(() => {
      const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
      return createAuthSessionRepository(localAuthSessionDataSource);
    }, []);

    const upsertAuthSessionUseCase = React.useMemo(
      () => createUpsertAuthSessionUseCase(authSessionRepository),
      [authSessionRepository],
    );

    const viewModel = useOtpVerificationViewModel({
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
    });

    return <OtpVerificationScreen viewModel={viewModel} />;
  };
};

export const createOtpVerificationScreenFactory = ({
  database,
  routeParams,
  onVerifiedExistingUser,
  onVerifiedNewUser,
  onInvalidRoute,
  onClose,
}: Params) => {
  return function OtpVerificationRouteScreenFactory(): React.JSX.Element {
    const phoneNumber = readStringParam(routeParams.phoneNumber).trim();
    const rawCountryIso = readStringParam(routeParams.countryIso);
    const countryIso: CountryIsoType =
      rawCountryIso && isCountryIso(rawCountryIso)
        ? rawCountryIso
        : CountryIso.Nepal;
    const rawCountryCode = readStringParam(routeParams.countryCode).trim();
    const countryCode =
      rawCountryCode.length > 0
        ? rawCountryCode
        : getDefaultCountryCode(countryIso);
    const languageCode = parseLanguageCode(
      readStringParam(routeParams.languageCode),
    );
    const isExistingUser = parseBoolean(
      readStringParam(routeParams.isExistingUser),
      false,
    );
    const otpReferenceId = readStringParam(routeParams.otpReferenceId).trim();
    const otpExpiresAt = parsePositiveNumber(
      readStringParam(routeParams.otpExpiresAt),
      Date.now() + DEFAULT_OTP_EXPIRES_AFTER_MS,
    );
    const resendAfterSeconds = parsePositiveNumber(
      readStringParam(routeParams.resendAfterSeconds),
      30,
    );

    const Screen = React.useMemo(
      () =>
        createOtpVerificationScreen({
          database,
          phoneNumber,
          countryCode,
          countryIso,
          languageCode,
          isExistingUser,
          otpReferenceId,
          otpExpiresAt,
          resendAfterSeconds,
          onVerified: (input) => {
            if (input.isExistingUser) {
              onVerifiedExistingUser();
              return;
            }

            onVerifiedNewUser(input.accountId);
          },
          onClose,
        }),
      [
        countryCode,
        countryIso,
        database,
        isExistingUser,
        languageCode,
        onClose,
        onVerifiedExistingUser,
        onVerifiedNewUser,
        otpExpiresAt,
        otpReferenceId,
        phoneNumber,
        resendAfterSeconds,
      ],
    );

    if (!phoneNumber || !otpReferenceId) {
      return onInvalidRoute();
    }

    return <Screen />;
  };
};
