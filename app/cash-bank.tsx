import React from "react";
import { router } from "expo-router";
import { createCashBankScreenFactory } from "@/features/cashBank/overview/factory/cashBankScreen.factory";
import { database } from "@/src/database/database";

export default function CashBankRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createCashBankScreenFactory({
        database,
        onAddAccountPress: () => {
          router.push("/account-form");
        },
        onEditAccountPress: (accountId: string) => {
          router.push({
            pathname: "/account-form",
            params: { accountId },
          });
        },
        onViewStatementPress: (accountId: string) => {
          router.push({
            pathname: "/account-statement",
            params: { accountId },
          });
        },
      }),
    [],
  );

  return <Screen />;
}
