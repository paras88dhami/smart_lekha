import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { bootstrapSelectedLanguage } from "@/shared/i18n/resources/bootstrapSelectedLanguage";
import { runAuthSeeds } from "@/src/database/database";

export default function RootLayout(): React.JSX.Element {
  const [isLanguageReady, setIsLanguageReady] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const bootstrapLanguage = async (): Promise<void> => {
      await runAuthSeeds();
      await bootstrapSelectedLanguage();

      if (isMounted) {
        setIsLanguageReady(true);
      }
    };

    void bootstrapLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLanguageReady) {
    return <SafeAreaProvider style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView  style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
