import { createLanguageSelectionFactory } from "@/features/auth/languageSelection/factory/languageSelectionScreenFactory";
import database from "@/src/database/database";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";

const LanguageScreenRoute = (): React.JSX.Element => {
  const LanguageSelectionScreen = useMemo(
    () =>
      createLanguageSelectionFactory({
        database,
        onContinue: () => {
          router.push("/(auth)/phone-auth");
        },
      }),
    [],
  );

  return (
 
      <LanguageSelectionScreen />
   
  );
};

export default LanguageScreenRoute;
