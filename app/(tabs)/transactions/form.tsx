import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { createTransactionFormScreenFactory } from "@/features/transactions/form/factory/transactionFormScreen.factory";
import { database } from "@/src/database/database";

type SearchParams = {
  transactionId?: string;
};

export default function TransactionFormRoute(): React.JSX.Element {
  const params = useLocalSearchParams<SearchParams>();
  const transactionId =
    typeof params.transactionId === "string" ? params.transactionId : null;

  const Screen = React.useMemo(
    () =>
      createTransactionFormScreenFactory({
        transactionId,
        database,
        onCompleted: () => {
          router.back();
        },
      }),
    [transactionId],
  );

  return <Screen />;
}
