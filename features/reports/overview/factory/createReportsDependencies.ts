import type { Database } from "@nozbe/watermelondb";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalPosSaleDataSource } from "@/features/pos/sale/data/dataSource/localPosSale.dataSource.impl";
import { createPosSaleRepository } from "@/features/pos/sale/data/repository/posSale.repository.impl";
import { createGetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/getRecentPosSales.useCase.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createGetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase.impl";
import { createGetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLoadReportsOverviewUseCase } from "../useCase/loadReportsOverview.useCase.impl";
import type { LoadReportsOverviewUseCase } from "../useCase/loadReportsOverview.useCase";

type Params = {
  database: Database;
};

export type ReportsDependencies = {
  loadReportsOverviewUseCase: LoadReportsOverviewUseCase;
};

export const createReportsDependencies = ({ database }: Params): ReportsDependencies => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );
  const posSaleRepository = createPosSaleRepository(createLocalPosSaleDataSource(database));
  const transferRecordRepository = createTransferRecordRepository(
    createLocalTransferRecordDataSource(database),
  );

  return {
    loadReportsOverviewUseCase: createLoadReportsOverviewUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      getFinanceSummaryUseCase: createGetFinanceSummaryUseCase(financeTransactionRepository),
      getFinanceTransactionsUseCase: createGetFinanceTransactionsUseCase(
        financeTransactionRepository,
      ),
      getRecentPosSalesUseCase: createGetRecentPosSalesUseCase(posSaleRepository),
      getSavedTransfersUseCase: createGetSavedTransfersUseCase(transferRecordRepository),
      getScheduledTransfersUseCase: createGetScheduledTransfersUseCase(
        transferRecordRepository,
      ),
    }),
  };
};
