import type { Database } from "@nozbe/watermelondb";
import React from "react";
import TransactionsScreen from "../ui/TransactionsScreen";
import { createTransactionsOverviewDependencies } from "./createTransactionsOverviewDependencies";
import { useTransactionsViewModel } from "../viewModel/transactions.viewModel.impl";

type Params = {
  database: Database;
  onAddTransactionPress: () => void;
  onQuickPosPress: () => void;
  onTransactionPress: (transactionId: string) => void;
};

export const createTransactionsScreenFactory = ({
  database,
  onAddTransactionPress,
  onQuickPosPress,
  onTransactionPress,
}: Params) => {
  return function TransactionsScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(
      () =>
        createTransactionsOverviewDependencies({
          database,
          onAddTransactionPress,
          onQuickPosPress,
          onTransactionPress,
        }),
      [],
    );
    const viewModel = useTransactionsViewModel(dependencies);

    return <TransactionsScreen viewModel={viewModel} />;
  };
};
