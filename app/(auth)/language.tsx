import { useMemo } from "react";
import { router } from "expo-router";
import { createLanguageSelectionFactory } from "@/features/auth/languageSelection/factory/languageSelectionScreenFactory";
import database from "@/src/database/database";

export default function LanguageScreenRoute() {
  const Screen = useMemo(
    () =>
      createLanguageSelectionFactory({
        database,
        onContinue: () => {
          router.push("/(auth)/phone-auth");
        },
      }),
    [],
  );

  return <Screen />;
}
