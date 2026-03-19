import React from "react";
import { createQuickPosScreenFactory } from "@/features/transactions/quickPos/factory/quickPosScreen.factory";
import { database } from "@/src/database/database";

export default function QuickPosRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createQuickPosScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
