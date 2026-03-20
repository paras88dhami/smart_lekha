import React from "react";
import { router } from "expo-router";
import { createSendMoneyScreenFactory } from "@/features/sendMoney/overview/factory/sendMoneyScreen.factory";
import { database } from "@/src/database/database";

export default function InventoryRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createSendMoneyScreenFactory({
        database,
        onViewAllSavedPress: () => {
          router.push("/reports");
        },
      }),
    [],
  );

  return <Screen />;
}
