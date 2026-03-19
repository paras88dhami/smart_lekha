import React from "react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { createOtpVerificationScreenFactory } from "@/features/auth/otpVerification/factory/otpVerificationScreen.factory";
import {
  CountryIso,
  isCountryIso,
  type CountryIsoType,
} from "@/features/auth/shared/country.types";
import type { LanguageCodeType } from "@/features/auth/languageSelection/types/types";
import { isSupportedLanguageCode } from "@/shared/i18n/resources";
import { database } from "@/src/database/database";

const DEFAULT_OTP_EXPIRES_AFTER_MS = 5 * 60 * 1000;

const parsePositiveNumber = (
  value: string | undefined,
  fallbackValue: number,
): number => {
  if (!value) {
    return fallbackValue;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallbackValue;
  }

  return parsedValue;
};

const parseLanguageCode = (value: string | undefined): LanguageCodeType => {
  if (value && isSupportedLanguageCode(value)) {
    return value;
  }

  return "en";
};

const parseBoolean = (
  value: string | undefined,
  fallbackValue: boolean,
): boolean => {
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

export default function OtpVerificationRoute(): React.JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber?: string;
    countryIso?: string;
    countryCode?: string;
    languageCode?: string;
    isExistingUser?: string;
    otpReferenceId?: string;
    otpExpiresAt?: string;
    resendAfterSeconds?: string;
  }>();

  const phoneNumber =
    typeof params.phoneNumber === "string" ? params.phoneNumber.trim() : "";
  const countryIso: CountryIsoType =
    typeof params.countryIso === "string" && isCountryIso(params.countryIso)
      ? params.countryIso
      : CountryIso.Nepal;
  const countryCode =
    typeof params.countryCode === "string" && params.countryCode.trim().length > 0
      ? params.countryCode.trim()
      : getDefaultCountryCode(countryIso);
  const languageCode = parseLanguageCode(
    typeof params.languageCode === "string" ? params.languageCode : undefined,
  );
  const isExistingUser = parseBoolean(
    typeof params.isExistingUser === "string" ? params.isExistingUser : undefined,
    false,
  );
  const otpReferenceId =
    typeof params.otpReferenceId === "string"
      ? params.otpReferenceId.trim()
      : "";
  const otpExpiresAt = parsePositiveNumber(
    typeof params.otpExpiresAt === "string" ? params.otpExpiresAt : undefined,
    Date.now() + DEFAULT_OTP_EXPIRES_AFTER_MS,
  );
  const resendAfterSeconds = parsePositiveNumber(
    typeof params.resendAfterSeconds === "string"
      ? params.resendAfterSeconds
      : undefined,
    30,
  );

  const Screen = React.useMemo(
    () =>
      createOtpVerificationScreenFactory({
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
            router.replace("/(tabs)/home");
            return;
          }

          router.replace({
            pathname: "/(auth)/select-profile",
            params: {
              accountId: input.accountId,
            },
          });
        },
        onClose: () => router.back(),
      }),
    [
      countryCode,
      countryIso,
      languageCode,
      isExistingUser,
      otpExpiresAt,
      otpReferenceId,
      phoneNumber,
      resendAfterSeconds,
      router,
    ],
  );

  if (!phoneNumber || !otpReferenceId) {
    return <Redirect href="/(auth)/phone-auth" />;
  }

  return <Screen />;
}