import React from "react";
import { router } from "expo-router";
import { createTransactionsScreenFactory } from "@/features/transactions/overview/factory/transactionsScreen.factory";
import { database } from "@/src/database/database";

export default function TransactionsRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createTransactionsScreenFactory({
        database,
        onAddTransactionPress: () => {
          router.push("/(tabs)/transactions/form");
        },
        onQuickPosPress: () => {
          router.push("/(tabs)/quick-pos" as never);
        },
        onTransactionPress: (transactionId: string) => {
          router.push({
            pathname: "/(tabs)/transactions/detail",
            params: { transactionId },
          });
        },
      }),
    [],
  );

  return <Screen />;
}
