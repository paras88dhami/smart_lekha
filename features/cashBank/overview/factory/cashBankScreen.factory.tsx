import React from "react";
import type { Database } from "@nozbe/watermelondb";
import CashBankScreen from "../ui/CashBankScreen";
import { createCashBankDependencies } from "./createCashBankDependencies";
import { useCashBankViewModel } from "../viewModel/cashBank.viewModel.impl";

type Params = {
  database: Database;
  onAddAccountPress: () => void;
  onEditAccountPress: (accountId: string) => void;
  onViewStatementPress: (accountId: string) => void;
};

export const createCashBankScreenFactory = ({
  database,
  onAddAccountPress,
  onEditAccountPress,
  onViewStatementPress,
}: Params) => {
  return function CashBankScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => createCashBankDependencies({ database }), []);
    const viewModel = useCashBankViewModel({
      ...dependencies,
      onAddAccountPress,
      onEditAccountPress,
      onViewStatementPress,
    });
    return <CashBankScreen viewModel={viewModel} />;
  };
};
