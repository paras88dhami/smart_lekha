import React from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { createOtpVerificationScreenFactory } from "@/features/auth/otpVerification/factory/otpVerificationScreen.factory";
import { database } from "@/src/database/database";

export default function OtpVerificationRoute(): React.JSX.Element {
  const routeParams = useLocalSearchParams<{
    phoneNumber?: string;
    countryIso?: string;
    countryCode?: string;
    languageCode?: string;
    isExistingUser?: string;
    otpReferenceId?: string;
    otpExpiresAt?: string;
    resendAfterSeconds?: string;
  }>();

  const Screen = React.useMemo(
    () =>
      createOtpVerificationScreenFactory({
        database,
        routeParams,
        onNavigateHome: () => {
          router.replace("/(tabs)/home");
        },
        onNavigateCreateProfile: (accountId: string) => {
          router.replace({
            pathname: "/(auth)/select-profile",
            params: {
              accountId,
              selectionMode: "create",
            },
          });
        },
        onNavigateSelectExistingProfile: (accountId: string) => {
          router.replace({
            pathname: "/(auth)/select-profile",
            params: {
              accountId,
              selectionMode: "select-existing",
            },
          });
        },
        onInvalidRoute: () => <Redirect href="/(auth)/phone-auth" />,
        onClose: () => {
          router.back();
        },
      }),
    [routeParams],
  );

  return <Screen />;
}
