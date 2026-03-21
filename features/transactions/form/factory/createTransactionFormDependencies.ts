import type { Database } from "@nozbe/watermelondb";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createDeleteFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/deleteFinanceTransaction.useCase.impl";
import { createGetFinanceTransactionByIdUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactionById.useCase.impl";
import { createUpdateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/updateFinanceTransaction.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLoadTransactionFormUseCase } from "../useCase/loadTransactionForm.useCase.impl";
import { createSubmitTransactionFormUseCase } from "../useCase/submitTransactionForm.useCase.impl";

type Params = {
  database: Database;
};

export const createTransactionFormDependencies = ({ database }: Params) => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const getActiveProfileUseCase = createGetActiveProfileUseCase(activeProfileRepository);
  const appSettingUseCases = createAppSettingUseCases(database);
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );

  return {
    loadTransactionFormUseCase: createLoadTransactionFormUseCase({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase: createEnsureDefaultFinanceAccountsUseCase(
        financeAccountRepository,
      ),
      getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
        financeAccountRepository,
      ),
      getActiveAccountUseCase: createGetActiveAccountUseCase({
        getActiveProfileUseCase,
        getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
        getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
          financeAccountRepository,
        ),
        getPrimaryFinanceAccountUseCase: createGetPrimaryFinanceAccountUseCase(
          financeAccountRepository,
        ),
        setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
      }),
      getFinanceTransactionByIdUseCase: createGetFinanceTransactionByIdUseCase(
        financeTransactionRepository,
      ),
    }),
    submitTransactionFormUseCase: createSubmitTransactionFormUseCase({
      getActiveProfileUseCase,
      getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
        financeAccountRepository,
      ),
      getFinanceTransactionByIdUseCase: createGetFinanceTransactionByIdUseCase(
        financeTransactionRepository,
      ),
      createFinanceTransactionUseCase: createCreateFinanceTransactionUseCase(
        financeTransactionRepository,
      ),
      updateFinanceTransactionUseCase: createUpdateFinanceTransactionUseCase(
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
