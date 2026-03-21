import type { Database } from "@nozbe/watermelondb";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createArchiveFinanceAccountUseCase } from "@/features/finance/account/useCase/archiveFinanceAccount.useCase.impl";
import { createCreateFinanceAccountUseCase } from "@/features/finance/account/useCase/createFinanceAccount.useCase.impl";
import { createGetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createUpdateFinanceAccountUseCase } from "@/features/finance/account/useCase/updateFinanceAccount.useCase.impl";
import { createSetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/setActiveAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createArchiveCashBankAccountFormUseCase } from "../useCase/archiveCashBankAccountForm.useCase.impl";
import { createLoadCashBankAccountFormUseCase } from "../useCase/loadCashBankAccountForm.useCase.impl";
import { createSubmitCashBankAccountFormUseCase } from "../useCase/submitCashBankAccountForm.useCase.impl";

type Params = {
  database: Database;
};

export const createCashBankAccountFormDependencies = ({ database }: Params) => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const appSettingUseCases = createAppSettingUseCases(database);
  const getActiveProfileUseCase = createGetActiveProfileUseCase(activeProfileRepository);

  return {
    loadCashBankAccountFormUseCase: createLoadCashBankAccountFormUseCase({
      getActiveProfileUseCase,
      getFinanceAccountByIdUseCase: createGetFinanceAccountByIdUseCase(financeAccountRepository),
    }),
    submitCashBankAccountFormUseCase: createSubmitCashBankAccountFormUseCase({
      getActiveProfileUseCase,
      getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
        financeAccountRepository,
      ),
      getFinanceAccountByIdUseCase: createGetFinanceAccountByIdUseCase(financeAccountRepository),
      createFinanceAccountUseCase: createCreateFinanceAccountUseCase(financeAccountRepository),
      updateFinanceAccountUseCase: createUpdateFinanceAccountUseCase(financeAccountRepository),
      setActiveAccountUseCase: createSetActiveAccountUseCase({
        getActiveProfileUseCase,
        getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
          financeAccountRepository,
        ),
        setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
      }),
    }),
    archiveCashBankAccountFormUseCase: createArchiveCashBankAccountFormUseCase({
      getActiveProfileUseCase,
      getFinanceAccountByIdUseCase: createGetFinanceAccountByIdUseCase(financeAccountRepository),
      archiveFinanceAccountUseCase: createArchiveFinanceAccountUseCase(financeAccountRepository),
    }),
  };
};
