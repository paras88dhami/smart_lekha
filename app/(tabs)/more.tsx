import React from "react";
import { useRouter } from "expo-router";
import { createMoreScreenFactory } from "@/features/more/overview/factory/moreScreen.factory";
import { database } from "@/src/database/database";

export default function MoreRoute(): React.JSX.Element {
  const router = useRouter();

  const Screen = React.useMemo(
    () =>
      createMoreScreenFactory({
        database,
        onLoggedOut: () => {
          router.replace("/(auth)/language");
        },
      }),
    [router],
  );

  return <Screen />;
}