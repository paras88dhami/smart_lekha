import React from "react";
import { useRouter } from "expo-router";
import { createPhoneEntryScreen } from "@/features/auth/phoneEntry/factory/phoneEntryScreen.factory";
import { useKhataSession } from "@/shared/context/KhataSessionContext";

export default function PhoneAuthRoute(): React.JSX.Element {
  const router = useRouter();
  const { state, updatePhoneNumber } = useKhataSession();
  const Screen = React.useMemo(
    () =>
      createPhoneEntryScreen({
        initialPhoneNumber: state.phoneNumber,
        onContinue: (phoneNumber: string) => {
          updatePhoneNumber(phoneNumber);
          router.push("/(tabs)/home");
        },
        onClose: () => router.back(),
      }),
    [router, state.phoneNumber, updatePhoneNumber],
  );
  return <Screen />;
}
