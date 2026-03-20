import React from "react";
import { router } from "expo-router";
import { createCreateBusinessScreenFactory } from "@/features/profile/createBusiness/factory/createBusinessScreen.factory";
import { database } from "@/src/database/database";

export default function CreateBusinessRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createCreateBusinessScreenFactory({
        database,
        onCreated: () => {
          router.replace("/(tabs)/home");
        },
      }),
    [],
  );

  return <Screen />;
}
