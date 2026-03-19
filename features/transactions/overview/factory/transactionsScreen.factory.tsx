import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import TransactionsScreen from "../ui/TransactionsScreen";
import { useTransactionsViewModel } from "../viewModel/transactions.viewModel.impl";

type Params = {
  database: Database;
  onQuickPosPress: () => void;
};

export const createTransactionsScreenFactory = ({
  database,
  onQuickPosPress,
}: Params) => {
  return function TransactionsScreenFactory(): React.JSX.Element {
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

    const adjustFinanceAccountBalanceUseCase = React.useMemo(
      () => createAdjustFinanceAccountBalanceUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const financeTransactionRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceTransactionDataSource(database);

      return createFinanceTransactionRepository(localDataSource);
    }, [database]);

    const getFinanceTransactionsUseCase = React.useMemo(
      () => createGetFinanceTransactionsUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const createFinanceTransactionUseCase = React.useMemo(
      () => createCreateFinanceTransactionUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const viewModel = useTransactionsViewModel({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase,
      getPrimaryFinanceAccountUseCase,
      getFinanceTransactionsUseCase,
      createFinanceTransactionUseCase,
      adjustFinanceAccountBalanceUseCase,
      onQuickPosPress,
    });

    return <TransactionsScreen viewModel={viewModel} />;
  };
};
