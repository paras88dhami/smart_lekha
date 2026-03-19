import type { Database } from "@nozbe/watermelondb";
import React from "react";
import type { CountryIsoType } from "../../shared/country.types";
import type { LanguageCodeType } from "../../languageSelection/types/types";
import { createLocalOtpRequestDataSource } from "../../otp/data/dataSource/localOtpRequest.dataSource.impl";
import { createRemoteOtpAuthDataSource } from "../../otp/data/dataSource/remoteOtpAuth.dataSource.impl";
import { createOtpRepository } from "../../otp/data/repository/otp.repository.impl";
import { createRequestOtpUseCase } from "../../otp/useCase/requestOtp.useCase.impl";
import { createVerifyOtpUseCase } from "../../otp/useCase/verifyOtp.useCase.impl";
import { createLocalAuthSessionDataSource } from "../../session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "../../session/data/repository/authSession.repository.impl";
import { createUpsertAuthSessionUseCase } from "../../session/useCase/upsertAuthSession.useCase.impl";
import type { OtpVerificationResult } from "../types/types";
import OtpVerificationScreen from "../ui/OtpVerificationScreen";
import { useOtpVerificationViewModel } from "../viewModel/otpVerification.viewModel.impl";

type Params = {
  database: Database;
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  languageCode: LanguageCodeType;
  isExistingUser: boolean;
  otpReferenceId: string;
  otpExpiresAt: number;
  resendAfterSeconds: number;
  onVerified: (input: OtpVerificationResult) => void;
  onClose: () => void;
};

export const createOtpVerificationScreenFactory = ({
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
}: Params) => {
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
