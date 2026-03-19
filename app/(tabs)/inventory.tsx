import React from "react";
import { router } from "expo-router";
import { createInventoryScreenFactory } from "@/features/inventory/overview/factory/inventoryScreen.factory";
import { database } from "@/src/database/database";

export default function InventoryRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createInventoryScreenFactory({
        database,
        onViewAllSavedPress: () => {
          router.push("/reports");
        },
      }),
    [],
  );

  return <Screen />;
}
