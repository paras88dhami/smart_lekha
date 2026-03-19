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
import { createLocalTransferBeneficiaryDataSource } from "@/features/transfers/beneficiary/data/dataSource/localTransferBeneficiary.dataSource.impl";
import { createTransferBeneficiaryRepository } from "@/features/transfers/beneficiary/data/repository/transferBeneficiary.repository.impl";
import { createCreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase.impl";
import { createGetFavoriteTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getFavoriteTransferBeneficiaries.useCase.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import {
  createCreateTransferRecordUseCase,
  createGetSavedTransfersUseCase,
} from "@/features/transfers/record/useCase/useCases.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import InventoryScreen from "../ui/InventoryScreen";
import { useInventoryViewModel } from "../viewModel/inventory.viewModel.impl";

type Params = {
  database: Database;
  onViewAllSavedPress: () => void;
};

export const createInventoryScreenFactory = ({
  database,
  onViewAllSavedPress,
}: Params) => {
  return function InventoryScreenFactory(): React.JSX.Element {
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

    const transferBeneficiaryRepository = React.useMemo(() => {
      const localDataSource = createLocalTransferBeneficiaryDataSource(database);
      return createTransferBeneficiaryRepository(localDataSource);
    }, [database]);

    const getFavoriteTransferBeneficiariesUseCase = React.useMemo(
      () =>
        createGetFavoriteTransferBeneficiariesUseCase(
          transferBeneficiaryRepository,
        ),
      [transferBeneficiaryRepository],
    );

    const createTransferBeneficiaryUseCase = React.useMemo(
      () => createCreateTransferBeneficiaryUseCase(transferBeneficiaryRepository),
      [transferBeneficiaryRepository],
    );

    const transferRecordRepository = React.useMemo(() => {
      const localDataSource = createLocalTransferRecordDataSource(database);
      return createTransferRecordRepository(localDataSource);
    }, [database]);

    const getSavedTransfersUseCase = React.useMemo(
      () => createGetSavedTransfersUseCase(transferRecordRepository),
      [transferRecordRepository],
    );

    const createTransferRecordUseCase = React.useMemo(
      () => createCreateTransferRecordUseCase(transferRecordRepository),
      [transferRecordRepository],
    );

    const viewModel = useInventoryViewModel({
      getActiveProfileUseCase,
      ensureDefaultFinanceAccountsUseCase,
      getPrimaryFinanceAccountUseCase,
      adjustFinanceAccountBalanceUseCase,
      createFinanceTransactionUseCase,
      getFavoriteTransferBeneficiariesUseCase,
      createTransferBeneficiaryUseCase,
      getSavedTransfersUseCase,
      createTransferRecordUseCase,
      onViewAllSavedPress,
    });

    return <InventoryScreen viewModel={viewModel} />;
  };
};
