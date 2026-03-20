import React from "react";
import { router } from "expo-router";
import { createProfileSelectionScreenFactory } from "@/features/profile/profileSelection/factory/profileSelectionScreen.factory";
import { database } from "@/src/database/database";

export default function ProfileSelectionRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createProfileSelectionScreenFactory({
        database,
        onActivated: () => {
          router.replace("/(tabs)/home");
        },
        onCreateBusiness: () => {
          router.push("/create-business");
        },
      }),
    [],
  );

  return <Screen />;
}
