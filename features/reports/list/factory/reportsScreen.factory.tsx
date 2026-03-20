import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createGetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/useCases.impl";
import { createLocalPosSaleDataSource } from "@/features/pos/sale/data/dataSource/localPosSale.dataSource.impl";
import { createPosSaleRepository } from "@/features/pos/sale/data/repository/posSale.repository.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createGetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase.impl";
import { createGetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import ReportsScreen from "../ui/ReportsScreen";
import { useReportsViewModel } from "../viewModel/reports.viewModel.impl";

type Params = {
  database: Database;
};

export const createReportsScreenFactory = ({ database }: Params) => {
  return function ReportsScreenFactory(): React.JSX.Element {
    const getActiveProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalActiveProfileDataSource(database);
      const repository = createActiveProfileRepository(localDataSource);

      return createGetActiveProfileUseCase(repository);
    }, []);

    const financeTransactionRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceTransactionDataSource(database);
      return createFinanceTransactionRepository(localDataSource);
    }, []);

    const getFinanceSummaryUseCase = React.useMemo(
      () => createGetFinanceSummaryUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const getFinanceTransactionsUseCase = React.useMemo(
      () => createGetFinanceTransactionsUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const posSaleRepository = React.useMemo(() => {
      const localDataSource = createLocalPosSaleDataSource(database);
      return createPosSaleRepository(localDataSource);
    }, []);

    const getRecentPosSalesUseCase = React.useMemo(
      () => createGetRecentPosSalesUseCase(posSaleRepository),
      [posSaleRepository],
    );

    const transferRecordRepository = React.useMemo(() => {
      const localDataSource = createLocalTransferRecordDataSource(database);
      return createTransferRecordRepository(localDataSource);
    }, []);

    const getSavedTransfersUseCase = React.useMemo(
      () => createGetSavedTransfersUseCase(transferRecordRepository),
      [transferRecordRepository],
    );

    const getScheduledTransfersUseCase = React.useMemo(
      () => createGetScheduledTransfersUseCase(transferRecordRepository),
      [transferRecordRepository],
    );

    const viewModel = useReportsViewModel({
      getActiveProfileUseCase,
      getFinanceSummaryUseCase,
      getFinanceTransactionsUseCase,
      getRecentPosSalesUseCase,
      getSavedTransfersUseCase,
      getScheduledTransfersUseCase,
    });

    return <ReportsScreen viewModel={viewModel} />;
  };
};
