import type { Database } from "@nozbe/watermelondb";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createCreateFinanceAccountUseCase } from "@/features/finance/account/useCase/createFinanceAccount.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createSetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/setPrimaryFinanceAccount.useCase.impl";
import { createSetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/setActiveAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createCreateCashBankAccountUseCase } from "../useCase/createCashBankAccount.useCase.impl";
import { createLoadCashBankOverviewUseCase } from "../useCase/loadCashBankOverview.useCase.impl";
import { createSetCashBankPrimaryAccountUseCase } from "../useCase/setCashBankPrimaryAccount.useCase.impl";
import type { CreateCashBankAccountUseCase } from "../useCase/createCashBankAccount.useCase";
import type { LoadCashBankOverviewUseCase } from "../useCase/loadCashBankOverview.useCase";
import type { SetCashBankPrimaryAccountUseCase } from "../useCase/setCashBankPrimaryAccount.useCase";

type Params = {
  database: Database;
};

export type CashBankDependencies = {
  loadCashBankOverviewUseCase: LoadCashBankOverviewUseCase;
  createCashBankAccountUseCase: CreateCashBankAccountUseCase;
  setCashBankPrimaryAccountUseCase: SetCashBankPrimaryAccountUseCase;
};

export const createCashBankDependencies = ({ database }: Params): CashBankDependencies => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const appSettingUseCases = createAppSettingUseCases(database);
  const setActiveAccountUseCase = createSetActiveAccountUseCase({
    getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
    getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
      financeAccountRepository,
    ),
    setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
  });

  return {
    loadCashBankOverviewUseCase: createLoadCashBankOverviewUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      ensureDefaultFinanceAccountsUseCase: createEnsureDefaultFinanceAccountsUseCase(
        financeAccountRepository,
      ),
      getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
        financeAccountRepository,
      ),
    }),
    createCashBankAccountUseCase: createCreateCashBankAccountUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
        financeAccountRepository,
      ),
      createFinanceAccountUseCase: createCreateFinanceAccountUseCase(financeAccountRepository),
      setActiveAccountUseCase,
    }),
    setCashBankPrimaryAccountUseCase: createSetCashBankPrimaryAccountUseCase({
      setPrimaryFinanceAccountUseCase: createSetPrimaryFinanceAccountUseCase(
        financeAccountRepository,
      ),
      setActiveAccountUseCase,
    }),
  };
};
