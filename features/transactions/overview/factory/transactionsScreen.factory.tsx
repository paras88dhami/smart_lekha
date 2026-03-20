import type { Database } from "@nozbe/watermelondb";
import React from "react";
import TransactionsScreen from "../ui/TransactionsScreen";
import { createTransactionsOverviewDependencies } from "./createTransactionsOverviewDependencies";
import { useTransactionsViewModel } from "../viewModel/transactions.viewModel.impl";

type Params = {
  database: Database;
  onQuickPosPress: () => void;
};

export const createTransactionsScreenFactory = ({
  database,
  onQuickPosPress,
}: Params) => {
  return function TransactionsScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(
      () => createTransactionsOverviewDependencies({ database, onQuickPosPress }),
      [],
    );
    const viewModel = useTransactionsViewModel(dependencies);

    return <TransactionsScreen viewModel={viewModel} />;
  };
};
