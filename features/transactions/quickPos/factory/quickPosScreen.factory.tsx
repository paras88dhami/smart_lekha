import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalPosItemDataSource } from "@/features/pos/item/data/dataSource/localPosItem.dataSource.impl";
import { createPosItemRepository } from "@/features/pos/item/data/repository/posItem.repository.impl";
import {
  createEnsureDefaultPosItemsUseCase,
  createGetPosItemsUseCase,
  createUpdatePosItemStockUseCase,
} from "@/features/pos/item/useCase/useCases.impl";
import { createLocalPosSaleDataSource } from "@/features/pos/sale/data/dataSource/localPosSale.dataSource.impl";
import { createPosSaleRepository } from "@/features/pos/sale/data/repository/posSale.repository.impl";
import { createCreatePosSaleUseCase } from "@/features/pos/sale/useCase/useCases.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import QuickPosScreen from "../ui/QuickPosScreen";
import { useQuickPosViewModel } from "../viewModel/quickPos.viewModel.impl";

type Params = {
  database: Database;
};

export const createQuickPosScreenFactory = ({
  database,
}: Params) => {
  return function QuickPosScreenFactory(): React.JSX.Element {
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

    const createFinanceTransactionUseCase = React.useMemo(
      () => createCreateFinanceTransactionUseCase(financeTransactionRepository),
      [financeTransactionRepository],
    );

    const posItemRepository = React.useMemo(() => {
      const localDataSource = createLocalPosItemDataSource(database);
      return createPosItemRepository(localDataSource);
    }, [database]);

    const ensureDefaultPosItemsUseCase = React.useMemo(
      () => createEnsureDefaultPosItemsUseCase(posItemRepository),
      [posItemRepository],
    );

    const getPosItemsUseCase = React.useMemo(
      () => createGetPosItemsUseCase(posItemRepository),
      [posItemRepository],
    );

    const updatePosItemStockUseCase = React.useMemo(
      () => createUpdatePosItemStockUseCase(posItemRepository),
      [posItemRepository],
    );

    const posSaleRepository = React.useMemo(() => {
      const localDataSource = createLocalPosSaleDataSource(database);
      return createPosSaleRepository(localDataSource);
    }, [database]);

    const createPosSaleUseCase = React.useMemo(
      () => createCreatePosSaleUseCase(posSaleRepository),
      [posSaleRepository],
    );

    const viewModel = useQuickPosViewModel({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase,
      getPrimaryFinanceAccountUseCase,
      adjustFinanceAccountBalanceUseCase,
      createFinanceTransactionUseCase,
      ensureDefaultPosItemsUseCase,
      getPosItemsUseCase,
      updatePosItemStockUseCase,
      createPosSaleUseCase,
    });

    return <QuickPosScreen viewModel={viewModel} />;
  };
};
