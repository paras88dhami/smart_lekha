import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createGetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import NotificationsScreen from "../ui/NotificationsScreen";
import { useNotificationsViewModel } from "../viewModel/notifications.viewModel.impl";

type Params = {
  database: Database;
};

export const createNotificationsScreenFactory = ({
  database,
}: Params) => {
  return function NotificationsScreenFactory(): React.JSX.Element {
    const getActiveProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalActiveProfileDataSource(database);
      const repository = createActiveProfileRepository(localDataSource);

      return createGetActiveProfileUseCase(repository);
    }, []);

    const financeTransactionRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceTransactionDataSource(database);
      return createFinanceTransactionRepository(localDataSource);
    }, []);

    const getFinanceTransactionsUseCase = React.useMemo(
      () => createGetFinanceTransactionsUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const transferRecordRepository = React.useMemo(() => {
      const localDataSource = createLocalTransferRecordDataSource(database);
      return createTransferRecordRepository(localDataSource);
    }, []);

    const getScheduledTransfersUseCase = React.useMemo(
      () => createGetScheduledTransfersUseCase(transferRecordRepository),
      [transferRecordRepository],
    );

    const viewModel = useNotificationsViewModel({
      getActiveProfileUseCase,
      getFinanceTransactionsUseCase,
      getScheduledTransfersUseCase,
    });

    return <NotificationsScreen viewModel={viewModel} />;
  };
};
