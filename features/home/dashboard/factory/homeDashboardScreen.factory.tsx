import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createGetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase.impl";
import { createGetRecentFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getRecentFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalHomeShortcutDataSource } from "@/features/home/shortcut/data/dataSource/localHomeShortcut.dataSource.impl";
import { createHomeShortcutRepository } from "@/features/home/shortcut/data/repository/homeShortcut.repository.impl";
import { createEnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase.impl";
import { createGetHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getHomeShortcuts.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import HomeDashboardScreen from "../ui/HomeDashboardScreen";
import { useHomeDashboardViewModel } from "../viewModel/homeDashboard.viewModel.impl";

type Params = {
  database: Database;
  onMyProfilePress: () => void;
  onMyAccountsPress: () => void;
  onStatementPress: () => void;
  onEsewaPress: () => void;
  onQuickPosPress: () => void;
  onSendMoneyPress: () => void;
  onViewAllTransactionsPress: () => void;
  onNotificationsPress: () => void;
};

export const createHomeDashboardScreenFactory = ({
  database,
  onMyProfilePress,
  onMyAccountsPress,
  onStatementPress,
  onEsewaPress,
  onQuickPosPress,
  onSendMoneyPress,
  onViewAllTransactionsPress,
  onNotificationsPress,
}: Params) => {
  return function HomeDashboardScreenFactory(): React.JSX.Element {
    const getActiveProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalActiveProfileDataSource(database);
      const repository = createActiveProfileRepository(localDataSource);

      return createGetActiveProfileUseCase(repository);
    }, [database]);

    const financeAccountRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceAccountDataSource(database);

      return createFinanceAccountRepository(localDataSource);
    }, [database]);

    const ensureDefaultFinanceAccountsUseCase = React.useMemo(
      () => createEnsureDefaultFinanceAccountsUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const getPrimaryFinanceAccountUseCase = React.useMemo(
      () => createGetPrimaryFinanceAccountUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const financeTransactionRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceTransactionDataSource(database);

      return createFinanceTransactionRepository(localDataSource);
    }, [database]);

    const getRecentFinanceTransactionsUseCase = React.useMemo(
      () => createGetRecentFinanceTransactionsUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const getFinanceSummaryUseCase = React.useMemo(
      () => createGetFinanceSummaryUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const homeShortcutRepository = React.useMemo(() => {
      const localDataSource = createLocalHomeShortcutDataSource(database);
      return createHomeShortcutRepository(localDataSource);
    }, [database]);

    const ensureDefaultHomeShortcutsUseCase = React.useMemo(
      () => createEnsureDefaultHomeShortcutsUseCase(homeShortcutRepository),
      [homeShortcutRepository],
    );

    const getHomeShortcutsUseCase = React.useMemo(
      () => createGetHomeShortcutsUseCase(homeShortcutRepository),
      [homeShortcutRepository],
    );

    const viewModel = useHomeDashboardViewModel({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase,
      getPrimaryFinanceAccountUseCase,
      ensureDefaultHomeShortcutsUseCase,
      getHomeShortcutsUseCase,
      getRecentFinanceTransactionsUseCase,
      getFinanceSummaryUseCase,
      onMyProfilePress,
      onMyAccountsPress,
      onStatementPress,
      onEsewaPress,
      onQuickPosPress,
      onSendMoneyPress,
      onViewAllTransactionsPress,
      onNotificationsPress,
    });

    return <HomeDashboardScreen viewModel={viewModel} />;
  };
};
