import React from "react";
import type { Database } from "@nozbe/watermelondb";
import CashBankScreen from "../ui/CashBankScreen";
import { createCashBankDependencies } from "./createCashBankDependencies";
import { useCashBankViewModel } from "../viewModel/cashBank.viewModel.impl";

type Params = {
  database: Database;
};

export const createCashBankScreenFactory = ({ database }: Params) => {
  return function CashBankScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => createCashBankDependencies({ database }), []);
    const viewModel = useCashBankViewModel(dependencies);
    return <CashBankScreen viewModel={viewModel} />;
  };
};
