import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import QuickEntryScreen from "../ui/QuickEntryScreen";
import { useQuickEntryViewModel } from "../viewModel/quickEntry.viewModel.impl";

type Params = {
  database: Database;
};

export const createQuickEntryScreenFactory = ({ database }: Params) => {
  return function QuickEntryScreenFactory(): React.JSX.Element {
    const getActiveProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalActiveProfileDataSource(database);
      const repository = createActiveProfileRepository(localDataSource);

      return createGetActiveProfileUseCase(repository);
    }, []);

    const financeAccountRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceAccountDataSource(database);

      return createFinanceAccountRepository(localDataSource);
    }, []);
    const appSettingUseCases = React.useMemo(
      () => createAppSettingUseCases(database),
      [],
    );

    const ensureDefaultFinanceAccountsUseCase = React.useMemo(
      () => createEnsureDefaultFinanceAccountsUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const getActiveAccountUseCase = React.useMemo(() => {
      return createGetActiveAccountUseCase({
        getActiveProfileUseCase,
        getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
        getFinanceAccountsByProfileUseCase:
          createGetFinanceAccountsByProfileUseCase(financeAccountRepository),
        getPrimaryFinanceAccountUseCase:
          createGetPrimaryFinanceAccountUseCase(financeAccountRepository),
        setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
      });
    }, [appSettingUseCases, financeAccountRepository, getActiveProfileUseCase]);

    const adjustFinanceAccountBalanceUseCase = React.useMemo(
      () => createAdjustFinanceAccountBalanceUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const financeTransactionRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceTransactionDataSource(database);

      return createFinanceTransactionRepository(localDataSource);
    }, []);

    const createFinanceTransactionUseCase = React.useMemo(
      () => createCreateFinanceTransactionUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const getFinanceTransactionsUseCase = React.useMemo(
      () => createGetFinanceTransactionsUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const viewModel = useQuickEntryViewModel({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase,
      getActiveAccountUseCase,
      createFinanceTransactionUseCase,
      adjustFinanceAccountBalanceUseCase,
      getFinanceTransactionsUseCase,
    });

    return <QuickEntryScreen viewModel={viewModel} />;
  };
};
