import React from "react";
import { useRouter } from "expo-router";
import { createPhoneEntryScreen } from "@/features/auth/phoneEntry/factory/phoneEntryScreen.factory";

export default function PhoneAuthRoute(): React.JSX.Element {
  const router = useRouter();
  const Screen =
      createPhoneEntryScreen({
        initialPhoneNumber: "",
        onContinue: () => {
          router.push("/(tabs)/home");
        },
        onClose: () => router.back(),
      });
  

  return <Screen />;
}
