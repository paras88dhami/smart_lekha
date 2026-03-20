import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createLocalBusinessCategoryDataSource } from "@/features/auth/businessCategory/data/dataSource/localBusinessCategory.dataSource.impl";
import { createBusinessCategoryRepository } from "@/features/auth/businessCategory/data/repository/businessCategory.repository.impl";
import { createGetActiveBusinessCategoriesUseCase } from "@/features/auth/businessCategory/useCase/getActiveBusinessCategories.useCase.impl";
import { createLocalProfileDataSource } from "@/features/auth/profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "@/features/auth/profile/data/repository/profile.repository.impl";
import { createCreateProfileUseCase } from "@/features/auth/profile/useCase/createProfile.useCase.impl";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalHomeShortcutDataSource } from "@/features/home/shortcut/data/dataSource/localHomeShortcut.dataSource.impl";
import { createHomeShortcutRepository } from "@/features/home/shortcut/data/repository/homeShortcut.repository.impl";
import { createEnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase.impl";
import { createGetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createCreateBusinessProfileBootstrapUseCase } from "../useCase/createBusinessProfileBootstrap.useCase.impl";
import CreateBusinessScreen from "../ui/CreateBusinessScreen";
import { useCreateBusinessViewModel } from "../viewModel/createBusiness.viewModel.impl";

type Params = {
  database: Database;
  onCreated: () => void;
};

export const createCreateBusinessScreenFactory = ({
  database,
  onCreated,
}: Params) => {
  return function CreateBusinessScreenFactory(): React.JSX.Element {
    const getCurrentAuthSessionUseCase = React.useMemo(() => {
      const localDataSource = createLocalAuthSessionDataSource(database);
      const repository = createAuthSessionRepository(localDataSource);

      return createGetCurrentAuthSessionUseCase(repository);
    }, []);

    const getActiveBusinessCategoriesUseCase = React.useMemo(() => {
      const localDataSource = createLocalBusinessCategoryDataSource(database);
      const repository = createBusinessCategoryRepository(localDataSource);

      return createGetActiveBusinessCategoriesUseCase(repository);
    }, []);

    const createProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalProfileDataSource(database);
      const repository = createProfileRepository(localDataSource);

      return createCreateProfileUseCase(repository);
    }, []);

    const appSettingUseCases = React.useMemo(
      () => createAppSettingUseCases(database),
      [],
    );
    const financeAccountRepository = React.useMemo(() => {
      return createFinanceAccountRepository(createLocalFinanceAccountDataSource(database));
    }, []);
    const homeShortcutRepository = React.useMemo(() => {
      return createHomeShortcutRepository(createLocalHomeShortcutDataSource(database));
    }, []);
    const activeProfileRepository = React.useMemo(() => {
      return createActiveProfileRepository(createLocalActiveProfileDataSource(database));
    }, []);

    const createBusinessProfileBootstrapUseCase = React.useMemo(() => {
      return createCreateBusinessProfileBootstrapUseCase({
        createProfileUseCase,
        setActiveProfileIdUseCase: appSettingUseCases.setActiveProfileIdUseCase,
        clearActiveAccountIdUseCase:
          appSettingUseCases.clearActiveAccountIdUseCase,
        ensureDefaultFinanceAccountsUseCase:
          createEnsureDefaultFinanceAccountsUseCase(financeAccountRepository),
        ensureDefaultHomeShortcutsUseCase:
          createEnsureDefaultHomeShortcutsUseCase(homeShortcutRepository),
        getActiveAccountUseCase: createGetActiveAccountUseCase({
          getActiveProfileUseCase:
            createGetActiveProfileUseCase(activeProfileRepository),
          getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
          getFinanceAccountsByProfileUseCase:
            createGetFinanceAccountsByProfileUseCase(financeAccountRepository),
          getPrimaryFinanceAccountUseCase:
            createGetPrimaryFinanceAccountUseCase(financeAccountRepository),
          setActiveAccountIdUseCase:
            appSettingUseCases.setActiveAccountIdUseCase,
        }),
      });
    }, [
      activeProfileRepository,
      appSettingUseCases,
      createProfileUseCase,
      financeAccountRepository,
      homeShortcutRepository,
    ]);

    const viewModel = useCreateBusinessViewModel({
      getCurrentAuthSessionUseCase,
      getActiveBusinessCategoriesUseCase,
      createBusinessProfileBootstrapUseCase,
      onCreated,
    });

    return <CreateBusinessScreen viewModel={viewModel} />;
  };
};
