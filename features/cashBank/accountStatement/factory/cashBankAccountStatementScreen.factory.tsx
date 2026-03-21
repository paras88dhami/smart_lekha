import React from "react";
import type { Database } from "@nozbe/watermelondb";
import CashBankAccountStatementScreen from "../ui/CashBankAccountStatementScreen";
import { createCashBankAccountStatementDependencies } from "./createCashBankAccountStatementDependencies";
import { useCashBankAccountStatementViewModel } from "../viewModel/cashBankAccountStatement.viewModel.impl";

type Params = {
  accountId: string;
  database: Database;
  onTransactionPress: (transactionId: string) => void;
};

export const createCashBankAccountStatementScreenFactory = ({
  accountId,
  database,
  onTransactionPress,
}: Params) => {
  return function CashBankAccountStatementScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(
      () => createCashBankAccountStatementDependencies({ database }),
      [],
    );
    const viewModel = useCashBankAccountStatementViewModel({
      ...dependencies,
      accountId,
      onTransactionPress,
    });
    return <CashBankAccountStatementScreen viewModel={viewModel} />;
  };
};
