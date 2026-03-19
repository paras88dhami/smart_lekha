import {
  AuthDatabaseError,
  AuthServiceNotConfiguredError,
  AuthServiceUnavailableError,
  InvalidPhoneNumberError,
  OtpExpiredError,
  OtpInvalidCodeError,
  OtpRateLimitedError,
  OtpRequestNotFoundError,
  type AuthError,
} from "@/features/auth/shared/authError.types";
import type { OtpAuthRemoteDataSource } from "../dataSource/otpAuthRemote.dataSource";
import type { OtpRequestDataSource } from "../dataSource/otpRequest.dataSource";
import type { OtpRepository } from "./otp.repository";
import type {
  RequestOtpInput,
  RequestOtpResult,
  VerifyOtpInput,
  VerifyOtpResult,
} from "../../types/types";

const mapRemoteErrorToAuthError = (remoteErrorCode: string): AuthError => {
  switch (remoteErrorCode) {
    case "INVALID_PHONE":
      return InvalidPhoneNumberError;
    case "INVALID_OTP":
      return OtpInvalidCodeError;
    case "OTP_EXPIRED":
      return OtpExpiredError;
    case "OTP_REQUEST_NOT_FOUND":
      return OtpRequestNotFoundError;
    case "RATE_LIMITED":
      return OtpRateLimitedError;
    case "SERVICE_NOT_CONFIGURED":
      return AuthServiceNotConfiguredError;
    case "SERVICE_UNAVAILABLE":
      return AuthServiceUnavailableError;
    default:
      return AuthServiceUnavailableError;
  }
};

export const createOtpRepository = (
  remoteDataSource: OtpAuthRemoteDataSource,
  localDataSource: OtpRequestDataSource,
): OtpRepository => ({
  async requestOtp(input: RequestOtpInput) {
    const remoteResult = await remoteDataSource.requestOtp({
      phoneNumber: input.phoneNumber.trim(),
      countryCode: input.countryCode.trim(),
      countryIso: input.countryIso,
      languageCode: input.languageCode,
    });

    if (!remoteResult.success) {
      return {
        success: false,
        error: mapRemoteErrorToAuthError(remoteResult.error.code),
      };
    }

    const localPersistResult = await localDataSource.upsertOtpRequest({
      phoneNumber: input.phoneNumber.trim(),
      countryCode: input.countryCode.trim(),
      countryIso: input.countryIso,
      otpReferenceId: remoteResult.value.otpReferenceId,
      expiresAt: remoteResult.value.expiresAt,
    });

    if (!localPersistResult.success) {
      console.error("Failed to persist otp request locally", localPersistResult.error);
    }

    const value: RequestOtpResult = {
      otpReferenceId: remoteResult.value.otpReferenceId,
      expiresAt: remoteResult.value.expiresAt,
      resendAfterSeconds: remoteResult.value.resendAfterSeconds,
      isExistingUser: remoteResult.value.isExistingUser,
    };

    return {
      success: true,
      value,
    };
  },

  async verifyOtp(input: VerifyOtpInput) {
    const otpReferenceId = input.otpReferenceId.trim();
    const localOtpResult =
      await localDataSource.getOtpRequestByReferenceId(otpReferenceId);

    if (!localOtpResult.success) {
      return {
        success: false,
        error: AuthDatabaseError,
      };
    }

    const localOtpRequest = localOtpResult.value;

    if (localOtpRequest && localOtpRequest.expiresAt) {
      if (localOtpRequest.expiresAt < Date.now()) {
        return {
          success: false,
          error: OtpExpiredError,
        };
      }
    }

    const remoteResult = await remoteDataSource.verifyOtp({
      otpReferenceId,
      otpCode: input.otpCode.trim(),
      phoneNumber: input.phoneNumber.trim(),
      countryCode: input.countryCode.trim(),
      countryIso: input.countryIso,
    });

    if (!remoteResult.success) {
      return {
        success: false,
        error: mapRemoteErrorToAuthError(remoteResult.error.code),
      };
    }

    const markConsumedResult =
      await localDataSource.markOtpRequestConsumed(otpReferenceId);

    if (!markConsumedResult.success) {
      console.error("Failed to mark otp request as consumed", markConsumedResult.error);
    }

    const value: VerifyOtpResult = {
      accountId: remoteResult.value.accountId,
      accessToken: remoteResult.value.accessToken,
      refreshToken: remoteResult.value.refreshToken,
      isExistingUser: remoteResult.value.isExistingUser,
    };

    return {
      success: true,
      value,
    };
  },
});
