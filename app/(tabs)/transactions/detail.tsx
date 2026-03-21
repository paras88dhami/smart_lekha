import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { createTransactionDetailScreenFactory } from "@/features/transactions/detail/factory/transactionDetailScreen.factory";
import { database } from "@/src/database/database";

type SearchParams = {
  transactionId?: string;
};

export default function TransactionDetailRoute(): React.JSX.Element {
  const params = useLocalSearchParams<SearchParams>();
  const transactionId =
    typeof params.transactionId === "string" ? params.transactionId : "";

  const Screen = React.useMemo(
    () =>
      createTransactionDetailScreenFactory({
        transactionId,
        database,
        onEditPress: (nextTransactionId: string) => {
          router.push({
            pathname: "/(tabs)/transactions/form",
            params: { transactionId: nextTransactionId },
          });
        },
        onDeleted: () => {
          router.back();
        },
      }),
    [transactionId],
  );

  return <Screen />;
}
