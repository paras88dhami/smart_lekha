import type { Database } from "@nozbe/watermelondb";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createGetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetFinanceTransactionsByAccountUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionsByAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLoadCashBankAccountStatementUseCase } from "../useCase/loadCashBankAccountStatement.useCase.impl";

type Params = {
  database: Database;
};

export const createCashBankAccountStatementDependencies = ({ database }: Params) => {
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );

  return {
    loadCashBankAccountStatementUseCase: createLoadCashBankAccountStatementUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(
        createActiveProfileRepository(createLocalActiveProfileDataSource(database)),
      ),
      getFinanceAccountByIdUseCase: createGetFinanceAccountByIdUseCase(
        financeAccountRepository,
      ),
      getFinanceTransactionsByAccountUseCase: createGetFinanceTransactionsByAccountUseCase(
        financeTransactionRepository,
      ),
    }),
  };
};
