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
            pathname: "/(auth)/select-profile",
            params: {
              accountId: input.accountId,
            },
          });
        },
        onClose: () => router.back(),
      }),
    [router],
  );

  return <Screen />;
}
