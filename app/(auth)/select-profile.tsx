import React from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { createProfileTypeSelectionScreenFactory } from "@/features/auth/profileTypeSelection/factory/profileTypeSelectionScreen.factory";
import { database } from "@/src/database/database";

export default function SelectProfileRoute(): React.JSX.Element {
  const routeParams = useLocalSearchParams<{ accountId?: string }>();

  const Screen = React.useMemo(
    () =>
      createProfileTypeSelectionScreenFactory({
        database,
        accountId: routeParams.accountId,
        onContinue: () => {
          router.push("/(tabs)/home");
        },
        onClose: () => {
          router.back();
        },
        onInvalidAccess: () => <Redirect href="/(auth)/phone-auth" />,
      }),
    [routeParams.accountId],
  );

  return <Screen />;
}
