import type { Database } from "@nozbe/watermelondb";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createGetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase.impl";
import { createLocalPosItemDataSource } from "@/features/pos/item/data/dataSource/localPosItem.dataSource.impl";
import { createPosItemRepository } from "@/features/pos/item/data/repository/posItem.repository.impl";
import { createGetPosItemsUseCase } from "@/features/pos/item/useCase/getPosItems.useCase.impl";
import { createLocalPosSaleDataSource } from "@/features/pos/sale/data/dataSource/localPosSale.dataSource.impl";
import { createPosSaleRepository } from "@/features/pos/sale/data/repository/posSale.repository.impl";
import { createGetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/getRecentPosSales.useCase.impl";
import { createLocalTransferBeneficiaryDataSource } from "@/features/transfers/beneficiary/data/dataSource/localTransferBeneficiary.dataSource.impl";
import { createTransferBeneficiaryRepository } from "@/features/transfers/beneficiary/data/repository/transferBeneficiary.repository.impl";
import { createGetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createGetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase.impl";
import { createGetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import type { GenerateDownloadDataSnapshotUseCase } from "../useCase/generateDownloadDataSnapshot.useCase";
import { createGenerateDownloadDataSnapshotUseCase } from "../useCase/generateDownloadDataSnapshot.useCase.impl";

type Params = {
  database: Database;
};

export type DownloadDataDependencies = {
  generateDownloadDataSnapshotUseCase: GenerateDownloadDataSnapshotUseCase;
};

export const createDownloadDataDependencies = ({
  database,
}: Params): DownloadDataDependencies => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );
  const transferBeneficiaryRepository = createTransferBeneficiaryRepository(
    createLocalTransferBeneficiaryDataSource(database),
  );
  const transferRecordRepository = createTransferRecordRepository(
    createLocalTransferRecordDataSource(database),
  );
  const posItemRepository = createPosItemRepository(createLocalPosItemDataSource(database));
  const posSaleRepository = createPosSaleRepository(createLocalPosSaleDataSource(database));

  return {
    generateDownloadDataSnapshotUseCase: createGenerateDownloadDataSnapshotUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
        financeAccountRepository,
      ),
      getFinanceTransactionsUseCase: createGetFinanceTransactionsUseCase(
        financeTransactionRepository,
      ),
      getTransferBeneficiariesUseCase: createGetTransferBeneficiariesUseCase(
        transferBeneficiaryRepository,
      ),
      getSavedTransfersUseCase: createGetSavedTransfersUseCase(transferRecordRepository),
      getScheduledTransfersUseCase: createGetScheduledTransfersUseCase(
        transferRecordRepository,
      ),
      getPosItemsUseCase: createGetPosItemsUseCase(posItemRepository),
      getRecentPosSalesUseCase: createGetRecentPosSalesUseCase(posSaleRepository),
    }),
  };
};
