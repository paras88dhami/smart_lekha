import type { Database } from "@nozbe/watermelondb";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase.impl";
import { createGetRecentFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getRecentFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalHomeShortcutDataSource } from "@/features/home/shortcut/data/dataSource/localHomeShortcut.dataSource.impl";
import { createHomeShortcutRepository } from "@/features/home/shortcut/data/repository/homeShortcut.repository.impl";
import { createEnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase.impl";
import { createGetHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getHomeShortcuts.useCase.impl";
import { createLocalPaymentRecordDataSource } from "@/features/transactions/paymentRecord/data/dataSource/localPaymentRecord.dataSource.impl";
import { createPaymentRecordRepository } from "@/features/transactions/paymentRecord/data/repository/paymentRecord.repository.impl";
import { createGetOpenPaymentRecordsUseCase } from "@/features/transactions/paymentRecord/useCase/getOpenPaymentRecords.useCase.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createExecuteDueScheduledTransfersUseCase } from "@/features/transfers/record/useCase/executeDueScheduledTransfers.useCase.impl";
import { createExecuteTransferRecordUseCase } from "@/features/transfers/record/useCase/executeTransferRecord.useCase.impl";
import { createGetDueScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getDueScheduledTransfers.useCase.impl";
import { createUpdateTransferRecordStatusUseCase } from "@/features/transfers/record/useCase/updateTransferRecordStatus.useCase.impl";
import { createGetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase.impl";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLoadHomeDashboardUseCase } from "../useCase/loadHomeDashboard.useCase.impl";
import type { LoadHomeDashboardUseCase } from "../useCase/loadHomeDashboard.useCase";

type Params = {
  database: Database;
};

export type HomeDashboardDependencies = {
  loadHomeDashboardUseCase: LoadHomeDashboardUseCase;
};

export const createHomeDashboardDependencies = ({
  database,
}: Params): HomeDashboardDependencies => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );
  const homeShortcutRepository = createHomeShortcutRepository(
    createLocalHomeShortcutDataSource(database),
  );
  const paymentRecordRepository = createPaymentRecordRepository(
    createLocalPaymentRecordDataSource(database),
  );
  const transferRecordRepository = createTransferRecordRepository(
    createLocalTransferRecordDataSource(database),
  );
  const getActiveProfileUseCase = createGetActiveProfileUseCase(activeProfileRepository);
  const executeTransferRecordUseCase = createExecuteTransferRecordUseCase({
    getFinanceAccountByIdUseCase: createGetFinanceAccountByIdUseCase(
      financeAccountRepository,
    ),
    createFinanceTransactionUseCase: createCreateFinanceTransactionUseCase(
      financeTransactionRepository,
    ),
    adjustFinanceAccountBalanceUseCase: createAdjustFinanceAccountBalanceUseCase(
      financeAccountRepository,
    ),
  });
  const executeDueScheduledTransfersUseCase = createExecuteDueScheduledTransfersUseCase({
    getDueScheduledTransfersUseCase: createGetDueScheduledTransfersUseCase(
      transferRecordRepository,
    ),
    executeTransferRecordUseCase,
    updateTransferRecordStatusUseCase: createUpdateTransferRecordStatusUseCase(
      transferRecordRepository,
    ),
  });

  return {
    loadHomeDashboardUseCase: createLoadHomeDashboardUseCase({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase: createEnsureDefaultFinanceAccountsUseCase(
        financeAccountRepository,
      ),
      getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
        financeAccountRepository,
      ),
      ensureDefaultHomeShortcutsUseCase: createEnsureDefaultHomeShortcutsUseCase(
        homeShortcutRepository,
      ),
      getHomeShortcutsUseCase: createGetHomeShortcutsUseCase(homeShortcutRepository),
      getRecentFinanceTransactionsUseCase: createGetRecentFinanceTransactionsUseCase(
        financeTransactionRepository,
      ),
      getFinanceSummaryUseCase: createGetFinanceSummaryUseCase(
        financeTransactionRepository,
      ),
      getOpenPaymentRecordsUseCase: createGetOpenPaymentRecordsUseCase(
        paymentRecordRepository,
      ),
      executeDueScheduledTransfersUseCase,
    }),
  };
};
