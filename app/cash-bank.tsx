import React from "react";
import { createCashBankScreenFactory } from "@/features/cashBank/list/factory/cashBankScreen.factory";
import { database } from "@/src/database/database";

export default function CashBankRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createCashBankScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
