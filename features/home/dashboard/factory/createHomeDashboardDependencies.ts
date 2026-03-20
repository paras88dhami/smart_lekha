import type { Database } from "@nozbe/watermelondb";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createGetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase.impl";
import { createGetRecentFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getRecentFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalHomeShortcutDataSource } from "@/features/home/shortcut/data/dataSource/localHomeShortcut.dataSource.impl";
import { createHomeShortcutRepository } from "@/features/home/shortcut/data/repository/homeShortcut.repository.impl";
import { createEnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase.impl";
import { createGetHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getHomeShortcuts.useCase.impl";
import { createGetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase.impl";
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
  const appSettingUseCases = createAppSettingUseCases(database);

  return {
    loadHomeDashboardUseCase: createLoadHomeDashboardUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      ensureDefaultFinanceAccountsUseCase: createEnsureDefaultFinanceAccountsUseCase(
        financeAccountRepository,
      ),
      getActiveAccountUseCase: createGetActiveAccountUseCase({
        getActiveProfileUseCase: createGetActiveProfileUseCase(
          activeProfileRepository,
        ),
        getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
        getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
          financeAccountRepository,
        ),
        getPrimaryFinanceAccountUseCase: createGetPrimaryFinanceAccountUseCase(
          financeAccountRepository,
        ),
        setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
      }),
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
    }),
  };
};
