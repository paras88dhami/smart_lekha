import type { Database } from "@nozbe/watermelondb";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalPaymentRecordDataSource } from "@/features/transactions/paymentRecord/data/dataSource/localPaymentRecord.dataSource.impl";
import { createPaymentRecordRepository } from "@/features/transactions/paymentRecord/data/repository/paymentRecord.repository.impl";
import { createCreatePaymentRecordUseCase } from "@/features/transactions/paymentRecord/useCase/createPaymentRecord.useCase.impl";
import { createGetOpenPaymentRecordsUseCase } from "@/features/transactions/paymentRecord/useCase/getOpenPaymentRecords.useCase.impl";
import { createGetPaymentRecordByIdUseCase } from "@/features/transactions/paymentRecord/useCase/getPaymentRecordById.useCase.impl";
import { createSettlePaymentRecordUseCase } from "@/features/transactions/paymentRecord/useCase/settlePaymentRecord.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createCreateTransactionsPaymentRecordUseCase } from "../useCase/createTransactionsPaymentRecord.useCase.impl";
import { createLoadTransactionsOverviewUseCase } from "../useCase/loadTransactionsOverview.useCase.impl";
import { createSettleTransactionsPaymentRecordUseCase } from "../useCase/settleTransactionsPaymentRecord.useCase.impl";

type Params = {
  database: Database;
  onQuickPosPress: () => void;
};

export const createTransactionsOverviewDependencies = ({
  database,
  onQuickPosPress,
}: Params) => {
  const activeProfileDataSource = createLocalActiveProfileDataSource(database);
  const activeProfileRepository = createActiveProfileRepository(activeProfileDataSource);
  const getActiveProfileUseCase = createGetActiveProfileUseCase(activeProfileRepository);

  const financeAccountDataSource = createLocalFinanceAccountDataSource(database);
  const financeAccountRepository = createFinanceAccountRepository(
    financeAccountDataSource,
  );
  const ensureDefaultFinanceAccountsUseCase =
    createEnsureDefaultFinanceAccountsUseCase(financeAccountRepository);
  const getPrimaryFinanceAccountUseCase =
    createGetPrimaryFinanceAccountUseCase(financeAccountRepository);
  const adjustFinanceAccountBalanceUseCase =
    createAdjustFinanceAccountBalanceUseCase(financeAccountRepository);

  const financeTransactionDataSource = createLocalFinanceTransactionDataSource(database);
  const financeTransactionRepository = createFinanceTransactionRepository(
    financeTransactionDataSource,
  );
  const getFinanceTransactionsUseCase =
    createGetFinanceTransactionsUseCase(financeTransactionRepository);
  const createFinanceTransactionUseCase =
    createCreateFinanceTransactionUseCase(financeTransactionRepository);

  const paymentRecordDataSource = createLocalPaymentRecordDataSource(database);
  const paymentRecordRepository = createPaymentRecordRepository(paymentRecordDataSource);
  const createPaymentRecordUseCase =
    createCreatePaymentRecordUseCase(paymentRecordRepository);
  const getOpenPaymentRecordsUseCase =
    createGetOpenPaymentRecordsUseCase(paymentRecordRepository);
  const getPaymentRecordByIdUseCase =
    createGetPaymentRecordByIdUseCase(paymentRecordRepository);
  const settlePaymentRecordUseCase =
    createSettlePaymentRecordUseCase(paymentRecordRepository);

  return {
    loadTransactionsOverviewUseCase: createLoadTransactionsOverviewUseCase({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase,
      getFinanceTransactionsUseCase,
      getOpenPaymentRecordsUseCase,
    }),
    createTransactionsPaymentRecordUseCase:
      createCreateTransactionsPaymentRecordUseCase({
        getActiveProfileUseCase,
        createPaymentRecordUseCase,
      }),
    settleTransactionsPaymentRecordUseCase:
      createSettleTransactionsPaymentRecordUseCase({
        getActiveProfileUseCase,
        getPaymentRecordByIdUseCase,
        getPrimaryFinanceAccountUseCase,
        createFinanceTransactionUseCase,
        adjustFinanceAccountBalanceUseCase,
        settlePaymentRecordUseCase,
      }),
    onQuickPosPress,
  };
};
