import type { Database } from "@nozbe/watermelondb";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createGetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLoadNotificationsTimelineUseCase } from "../useCase/loadNotificationsTimeline.useCase.impl";
import type { LoadNotificationsTimelineUseCase } from "../useCase/loadNotificationsTimeline.useCase";

type Params = {
  database: Database;
};

export type NotificationsDependencies = {
  loadNotificationsTimelineUseCase: LoadNotificationsTimelineUseCase;
};

export const createNotificationsDependencies = ({
  database,
}: Params): NotificationsDependencies => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );
  const transferRecordRepository = createTransferRecordRepository(
    createLocalTransferRecordDataSource(database),
  );

  return {
    loadNotificationsTimelineUseCase: createLoadNotificationsTimelineUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      getFinanceTransactionsUseCase: createGetFinanceTransactionsUseCase(
        financeTransactionRepository,
      ),
      getScheduledTransfersUseCase: createGetScheduledTransfersUseCase(
        transferRecordRepository,
      ),
    }),
  };
};
