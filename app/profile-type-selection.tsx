import React from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { createProfileTypeSelectionScreenFactory } from "@/features/auth/profileTypeSelection/factory/profileTypeSelectionScreen.factory";
import { database } from "@/src/database/database";

export default function ProfileTypeSelectionRoute(): React.JSX.Element {
  const routeParams = useLocalSearchParams();
  const Screen = React.useMemo(
    () =>
      createProfileTypeSelectionScreenFactory({
        database,
        accountId: routeParams.accountId,
        selectionMode: routeParams.selectionMode,
        onContinue: () => {
          router.replace("/(tabs)/home");
        },
        onClose: () => {
          router.replace("/(auth)/phone-auth");
        },
        onInvalidAccess: () => {
          return <Redirect href="/(auth)/phone-auth" />;
        },
      }),
    [routeParams],
  );

  return <Screen />;
}
