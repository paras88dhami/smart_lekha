import type { Database } from "@nozbe/watermelondb";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createGetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createDeleteFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/deleteFinanceTransaction.useCase.impl";
import { createGetFinanceTransactionByIdUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionById.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createDeleteTransactionDetailUseCase } from "../useCase/deleteTransactionDetail.useCase.impl";
import { createLoadTransactionDetailUseCase } from "../useCase/loadTransactionDetail.useCase.impl";

type Params = {
  database: Database;
};

export const createTransactionDetailDependencies = ({ database }: Params) => {
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );
  const getActiveProfileUseCase = createGetActiveProfileUseCase(
    createActiveProfileRepository(createLocalActiveProfileDataSource(database)),
  );

  return {
    loadTransactionDetailUseCase: createLoadTransactionDetailUseCase({
      getActiveProfileUseCase,
      getFinanceTransactionByIdUseCase: createGetFinanceTransactionByIdUseCase(
        financeTransactionRepository,
      ),
      getFinanceAccountByIdUseCase: createGetFinanceAccountByIdUseCase(financeAccountRepository),
    }),
    deleteTransactionDetailUseCase: createDeleteTransactionDetailUseCase({
      getActiveProfileUseCase,
      getFinanceTransactionByIdUseCase: createGetFinanceTransactionByIdUseCase(
        financeTransactionRepository,
      ),
      deleteFinanceTransactionUseCase: createDeleteFinanceTransactionUseCase(
        financeTransactionRepository,
      ),
      adjustFinanceAccountBalanceUseCase: createAdjustFinanceAccountBalanceUseCase(
        financeAccountRepository,
      ),
    }),
  };
};
