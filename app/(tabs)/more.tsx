import React from "react";
import { useRouter } from "expo-router";
import { APP_FEATURE_CATALOG } from "@/features/more/overview/config/featureCatalog";
import { createMoreScreenFactory } from "@/features/more/overview/factory/moreScreen.factory";
import { database } from "@/src/database/database";

export default function MoreRoute(): React.JSX.Element {
  const router = useRouter();

  const Screen = React.useMemo(
    () =>
      createMoreScreenFactory({
        database,
        features: APP_FEATURE_CATALOG,
        onOpenFeature: (route) => {
          router.push(route as never);
        },
        onLoggedOut: () => {
          router.replace("/(auth)/language");
        },
      }),
    [router],
  );

  return <Screen />;
}
