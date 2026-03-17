import { createLanguageSelectionScreen } from "@/features/auth/languageSelection/factory/languageSelectionScreenFactory";
import database from "@/src/database/database";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";

const LanguageScreenRoute = (): React.JSX.Element => {
  const LanguageSelectionScreen = useMemo(
    () =>
      createLanguageSelectionScreen({
        database,
        onContinue: () => {
          router.push("/(auth)/onboarding");
        },
      }),
    [],
  );

  return (
    <View className="flex-1">
      <LanguageSelectionScreen />
    </View>
  );
};

export default LanguageScreenRoute;
