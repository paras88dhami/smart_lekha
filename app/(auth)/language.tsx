import React from "react";
import { useRouter } from "expo-router";
import { createLanguageSelectionScreen } from "@/features/auth/languageSelection/factory/languageSelectionScreen.factory";
import { useKhataSession } from "@/shared/context/KhataSessionContext";

export default function LanguageRoute(): React.JSX.Element {
  const router = useRouter();
  const { state } = useKhataSession();
  const Screen = React.useMemo(
    () =>
      createLanguageSelectionScreen({
        database: state.database,
        onContinue: () => router.push("/(auth)/onboarding"),
      }),
    [router, state.database],
  );
  return <Screen />;
}
