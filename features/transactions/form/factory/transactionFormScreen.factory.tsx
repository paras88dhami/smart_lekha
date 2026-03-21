import type { Database } from "@nozbe/watermelondb";
import React from "react";
import TransactionFormScreen from "../ui/TransactionFormScreen";
import { createTransactionFormDependencies } from "./createTransactionFormDependencies";
import { useTransactionFormViewModel } from "../viewModel/transactionForm.viewModel.impl";

type Params = {
  transactionId: string | null;
  database: Database;
  onCompleted: () => void;
};

export const createTransactionFormScreenFactory = ({
  transactionId,
  database,
  onCompleted,
}: Params) => {
  return function TransactionFormScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(
      () => createTransactionFormDependencies({ database }),
      [],
    );
    const viewModel = useTransactionFormViewModel({
      ...dependencies,
      transactionId,
      onCompleted,
    });
    return <TransactionFormScreen viewModel={viewModel} />;
  };
};
