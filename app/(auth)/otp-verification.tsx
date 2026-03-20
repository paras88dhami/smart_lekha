import React from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { createOtpVerificationScreenFactory } from "@/features/auth/otpVerification/factory/otpVerificationScreen.factory";
import { database } from "@/src/database/database";

export default function OtpVerificationRoute(): React.JSX.Element {
  const routeParams = useLocalSearchParams();
  const Screen = React.useMemo(
    () =>
      createOtpVerificationScreenFactory({
        database,
        routeParams,
        onNavigateHome: () => {
          router.replace("/");
        },
        onNavigateCreateProfile: () => {
          router.replace("/create-business");
        },
        onNavigateSelectExistingProfile: () => {
          router.replace("/profile-selection");
        },
        onInvalidRoute: () => {
          return <Redirect href="/(auth)/phone-auth" />;
        },
        onClose: () => {
          router.replace("/(auth)/phone-auth");
        },
      }),
    [routeParams],
  );

  return <Screen />;
}
