import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { createCashBankAccountStatementScreenFactory } from "@/features/cashBank/accountStatement/factory/cashBankAccountStatementScreen.factory";
import { database } from "@/src/database/database";

type SearchParams = {
  accountId?: string;
};

export default function CashBankAccountStatementRoute(): React.JSX.Element {
  const params = useLocalSearchParams<SearchParams>();
  const accountId = typeof params.accountId === "string" ? params.accountId : "";

  const Screen = React.useMemo(
    () =>
      createCashBankAccountStatementScreenFactory({
        accountId,
        database,
        onTransactionPress: (transactionId: string) => {
          router.push({
            pathname: "/transaction-detail",
            params: { transactionId },
          });
        },
      }),
    [accountId],
  );

  return <Screen />;
}
