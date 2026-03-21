import type { Database } from "@nozbe/watermelondb";
import React from "react";
import TransactionDetailScreen from "../ui/TransactionDetailScreen";
import { createTransactionDetailDependencies } from "./createTransactionDetailDependencies";
import { useTransactionDetailViewModel } from "../viewModel/transactionDetail.viewModel.impl";

type Params = {
  transactionId: string;
  database: Database;
  onEditPress: (transactionId: string) => void;
  onDeleted: () => void;
};

export const createTransactionDetailScreenFactory = ({
  transactionId,
  database,
  onEditPress,
  onDeleted,
}: Params) => {
  return function TransactionDetailScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(
      () => createTransactionDetailDependencies({ database }),
      [],
    );
    const viewModel = useTransactionDetailViewModel({
      ...dependencies,
      transactionId,
      onEditPress,
      onDeleted,
    });
    return <TransactionDetailScreen viewModel={viewModel} />;
  };
};
