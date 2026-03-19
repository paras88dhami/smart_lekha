import React from "react";
import { useRouter } from "expo-router";
import { createPhoneEntryScreen } from "@/features/auth/phoneEntry/factory/phoneEntryScreen.factory";
import { database } from "@/src/database/database";

export default function PhoneAuthRoute(): React.JSX.Element {
  const router = useRouter();

  const Screen = React.useMemo(
    () =>
      createPhoneEntryScreen({
        database,
        initialPhoneNumber: "",
        onContinue: (input) => {
          router.push({
            pathname: "/(auth)/otp-verification",
            params: {
              phoneNumber: input.phoneNumber,
              countryIso: input.countryIso,
              countryCode: input.countryCode,
              languageCode: input.languageCode,
              otpReferenceId: input.otpReferenceId,
              otpExpiresAt: String(input.otpExpiresAt),
              resendAfterSeconds: String(input.resendAfterSeconds),
              isExistingUser: String(input.isExistingUser),
            },
          });
        },
        onContinueOffline: () => {
          router.replace("/(tabs)/home");
        },
        onClose: () => router.back(),
      }),
    [router],
  );

  return <Screen />;
}