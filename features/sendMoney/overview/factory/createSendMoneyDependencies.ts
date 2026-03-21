import type { Database } from "@nozbe/watermelondb";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createGetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase.impl";
import { createLocalTransferBeneficiaryDataSource } from "@/features/transfers/beneficiary/data/dataSource/localTransferBeneficiary.dataSource.impl";
import { createTransferBeneficiaryRepository } from "@/features/transfers/beneficiary/data/repository/transferBeneficiary.repository.impl";
import { createCreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase.impl";
import { createGetFavoriteTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getFavoriteTransferBeneficiaries.useCase.impl";
import { createGetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase.impl";
import { createLocalTransferRecordDataSource } from "@/features/transfers/record/data/dataSource/localTransferRecord.dataSource.impl";
import { createTransferRecordRepository } from "@/features/transfers/record/data/repository/transferRecord.repository.impl";
import { createCreateTransferRecordUseCase } from "@/features/transfers/record/useCase/createTransferRecord.useCase.impl";
import { createExecuteDueScheduledTransfersUseCase } from "@/features/transfers/record/useCase/executeDueScheduledTransfers.useCase.impl";
import { createExecuteTransferRecordUseCase } from "@/features/transfers/record/useCase/executeTransferRecord.useCase.impl";
import { createGetDueScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getDueScheduledTransfers.useCase.impl";
import { createGetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase.impl";
import { createGetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase.impl";
import { createUpdateTransferRecordStatusUseCase } from "@/features/transfers/record/useCase/updateTransferRecordStatus.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLoadSendMoneyOverviewUseCase } from "../useCase/loadSendMoneyOverview.useCase.impl";
import { createResolveSendMoneyBeneficiaryUseCase } from "../useCase/resolveSendMoneyBeneficiary.useCase.impl";
import { createSubmitSendMoneyTransferUseCase } from "../useCase/submitSendMoneyTransfer.useCase.impl";
import type { LoadSendMoneyOverviewUseCase } from "../useCase/loadSendMoneyOverview.useCase";
import type { SubmitSendMoneyTransferUseCase } from "../useCase/submitSendMoneyTransfer.useCase";

type Params = {
  database: Database;
  onViewAllSavedPress: () => void;
};

export type SendMoneyDependencies = {
  loadSendMoneyOverviewUseCase: LoadSendMoneyOverviewUseCase;
  submitSendMoneyTransferUseCase: SubmitSendMoneyTransferUseCase;
  onViewAllSavedPress: () => void;
};

export const createSendMoneyDependencies = ({
  database,
  onViewAllSavedPress,
}: Params): SendMoneyDependencies => {
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
  const appSettingUseCases = createAppSettingUseCases(database);
  const getActiveProfileUseCase = createGetActiveProfileUseCase(activeProfileRepository);
  const getActiveAccountUseCase = createGetActiveAccountUseCase({
    getActiveProfileUseCase,
    getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
    getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
      financeAccountRepository,
    ),
    getPrimaryFinanceAccountUseCase: createGetPrimaryFinanceAccountUseCase(
      financeAccountRepository,
    ),
    setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
  });
  const getFinanceAccountsByProfileUseCase = createGetFinanceAccountsByProfileUseCase(
    financeAccountRepository,
  );
  const getFinanceAccountByIdUseCase = createGetFinanceAccountByIdUseCase(
    financeAccountRepository,
  );
  const createFinanceTransactionUseCase = createCreateFinanceTransactionUseCase(
    financeTransactionRepository,
  );
  const adjustFinanceAccountBalanceUseCase = createAdjustFinanceAccountBalanceUseCase(
    financeAccountRepository,
  );
  const executeTransferRecordUseCase = createExecuteTransferRecordUseCase({
    getFinanceAccountByIdUseCase,
    createFinanceTransactionUseCase,
    adjustFinanceAccountBalanceUseCase,
  });
  const updateTransferRecordStatusUseCase = createUpdateTransferRecordStatusUseCase(
    transferRecordRepository,
  );

  return {
    loadSendMoneyOverviewUseCase: createLoadSendMoneyOverviewUseCase({
      getActiveProfileUseCase,
      getActiveAccountUseCase,
      ensureDefaultFinanceAccountsUseCase: createEnsureDefaultFinanceAccountsUseCase(
        financeAccountRepository,
      ),
      getFinanceAccountsByProfileUseCase,
      getTransferBeneficiariesUseCase: createGetTransferBeneficiariesUseCase(
        transferBeneficiaryRepository,
      ),
      getFavoriteTransferBeneficiariesUseCase: createGetFavoriteTransferBeneficiariesUseCase(
        transferBeneficiaryRepository,
      ),
      getSavedTransfersUseCase: createGetSavedTransfersUseCase(transferRecordRepository),
      getScheduledTransfersUseCase: createGetScheduledTransfersUseCase(transferRecordRepository),
      executeDueScheduledTransfersUseCase: createExecuteDueScheduledTransfersUseCase({
        getDueScheduledTransfersUseCase: createGetDueScheduledTransfersUseCase(
          transferRecordRepository,
        ),
        executeTransferRecordUseCase,
        updateTransferRecordStatusUseCase,
      }),
    }),
    submitSendMoneyTransferUseCase: createSubmitSendMoneyTransferUseCase({
      getActiveProfileUseCase,
      getFinanceAccountByIdUseCase,
      resolveSendMoneyBeneficiaryUseCase: createResolveSendMoneyBeneficiaryUseCase({
        getTransferBeneficiariesUseCase: createGetTransferBeneficiariesUseCase(
          transferBeneficiaryRepository,
        ),
        createTransferBeneficiaryUseCase: createCreateTransferBeneficiaryUseCase(
          transferBeneficiaryRepository,
        ),
      }),
      createTransferRecordUseCase: createCreateTransferRecordUseCase(transferRecordRepository),
      executeTransferRecordUseCase,
      updateTransferRecordStatusUseCase,
    }),
    onViewAllSavedPress,
  };
};
