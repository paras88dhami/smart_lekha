import React from "react";
import { createQuickEntryScreenFactory } from "@/features/transactions/quickEntry/factory/quickEntryScreen.factory";
import { database } from "@/src/database/database";

export default function QuickEntryRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createQuickEntryScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
