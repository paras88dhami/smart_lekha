import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createCreateFinanceAccountUseCase } from "@/features/finance/account/useCase/createFinanceAccount.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createSetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/setPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import CashBankScreen from "../ui/CashBankScreen";
import { useCashBankViewModel } from "../viewModel/cashBank.viewModel.impl";

type Params = {
  database: Database;
};

export const createCashBankScreenFactory = ({ database }: Params) => {
  return function CashBankScreenFactory(): React.JSX.Element {
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

    const getFinanceAccountsByProfileUseCase = React.useMemo(
      () => createGetFinanceAccountsByProfileUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const createFinanceAccountUseCase = React.useMemo(
      () => createCreateFinanceAccountUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const setPrimaryFinanceAccountUseCase = React.useMemo(
      () => createSetPrimaryFinanceAccountUseCase(financeAccountRepository),
      [financeAccountRepository],
    );

    const viewModel = useCashBankViewModel({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase,
      getFinanceAccountsByProfileUseCase,
      createFinanceAccountUseCase,
      setPrimaryFinanceAccountUseCase,
    });

    return <CashBankScreen viewModel={viewModel} />;
  };
};
