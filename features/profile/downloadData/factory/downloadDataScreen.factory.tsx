import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetPosItemsUseCase } from "@/features/pos/item/useCase/useCases.impl";
import { createLocalPosItemDataSource } from "@/features/pos/item/data/dataSource/localPosItem.dataSource.impl";
import { createPosItemRepository } from "@/features/pos/item/data/repository/posItem.repository.impl";
import { createGetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/useCases.impl";
import { createLocalPosSaleDataSource } from "@/features/pos/sale/data/dataSource/localPosSale.dataSource.impl";
import { createPosSaleRepository } from "@/features/pos/sale/data/repository/posSale.repository.impl";
import { createLocalTransferBeneficiaryDataSource } from "@/features/transfers/beneficiary/data/dataSource/localTransferBeneficiary.dataSource.impl";
import { createTransferBeneficiaryRepository } from "@/features/transfers/beneficiary/data/repository/transferBeneficiary.repository.impl";
import { createGetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createGetSavedTransfersUseCase, createGetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/useCases.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import DownloadDataScreen from "../ui/DownloadDataScreen";
import { useDownloadDataViewModel } from "../viewModel/downloadData.viewModel.impl";

type Params = {
  database: Database;
};

export const createDownloadDataScreenFactory = ({ database }: Params) => {
  return function DownloadDataScreenFactory(): React.JSX.Element {
    const getActiveProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalActiveProfileDataSource(database);
      const repository = createActiveProfileRepository(localDataSource);

      return createGetActiveProfileUseCase(repository);
    }, [database]);

    const financeAccountRepository = React.useMemo(() => {
      const localDataSource = createLocalFinanceAccountDataSource(database);
      return createFinanceAccountRepository(localDataSource);
    }, [database]);

    const getFinanceAccountsByProfileUseCase = React.useMemo(
      () => createGetFinanceAccountsByProfileUseCase(financeAccountRepository),
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

    const transferBeneficiaryRepository = React.useMemo(() => {
      const localDataSource = createLocalTransferBeneficiaryDataSource(database);
      return createTransferBeneficiaryRepository(localDataSource);
    }, [database]);

    const getTransferBeneficiariesUseCase = React.useMemo(
      () => createGetTransferBeneficiariesUseCase(transferBeneficiaryRepository),
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

    const getScheduledTransfersUseCase = React.useMemo(
      () => createGetScheduledTransfersUseCase(transferRecordRepository),
      [transferRecordRepository],
    );

    const posItemRepository = React.useMemo(() => {
      const localDataSource = createLocalPosItemDataSource(database);
      return createPosItemRepository(localDataSource);
    }, [database]);

    const getPosItemsUseCase = React.useMemo(
      () => createGetPosItemsUseCase(posItemRepository),
      [posItemRepository],
    );

    const posSaleRepository = React.useMemo(() => {
      const localDataSource = createLocalPosSaleDataSource(database);
      return createPosSaleRepository(localDataSource);
    }, [database]);

    const getRecentPosSalesUseCase = React.useMemo(
      () => createGetRecentPosSalesUseCase(posSaleRepository),
      [posSaleRepository],
    );

    const viewModel = useDownloadDataViewModel({
      getActiveProfileUseCase,
      getFinanceAccountsByProfileUseCase,
      getFinanceTransactionsUseCase,
      getTransferBeneficiariesUseCase,
      getSavedTransfersUseCase,
      getScheduledTransfersUseCase,
      getPosItemsUseCase,
      getRecentPosSalesUseCase,
    });

    return <DownloadDataScreen viewModel={viewModel} />;
  };
};
