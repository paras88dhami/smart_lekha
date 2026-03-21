import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { createCashBankAccountFormScreenFactory } from "@/features/cashBank/accountForm/factory/cashBankAccountFormScreen.factory";
import { database } from "@/src/database/database";

type SearchParams = {
  accountId?: string;
};

export default function CashBankAccountFormRoute(): React.JSX.Element {
  const params = useLocalSearchParams<SearchParams>();
  const accountId = typeof params.accountId === "string" ? params.accountId : null;

  const Screen = React.useMemo(
    () =>
      createCashBankAccountFormScreenFactory({
        accountId,
        database,
        onCompleted: () => {
          router.back();
        },
      }),
    [accountId],
  );

  return <Screen />;
}
