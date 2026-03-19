import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createProfileTypeSelectionScreenFactory } from "@/features/auth/profileTypeSelection/factory/profileTypeSelectionScreen.factory";
import { database } from "@/src/database/database";

export default function SelectProfileRoute(): React.JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<{ accountId?: string }>();
  const accountId =
    typeof params.accountId === "string" && params.accountId.trim().length > 0
      ? params.accountId.trim()
      : "local-account";

  const Screen = React.useMemo(
    () =>
      createProfileTypeSelectionScreenFactory({
        database,
        accountId,
        onContinue: () => {
          router.push("/(tabs)/home");
        },
        onClose: () => router.back(),
      }),
    [accountId, router],
  );

  return <Screen />;
}
