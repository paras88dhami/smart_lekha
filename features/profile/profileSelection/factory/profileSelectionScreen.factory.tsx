import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createLocalProfileDataSource } from "@/features/auth/profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "@/features/auth/profile/data/repository/profile.repository.impl";
import { createGetProfilesByAccountIdUseCase } from "@/features/auth/profile/useCase/getProfilesByAccountId.useCase.impl";
import { createSetActiveProfileUseCase } from "@/features/auth/profile/useCase/setActiveProfile.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalHomeShortcutDataSource } from "@/features/home/shortcut/data/dataSource/localHomeShortcut.dataSource.impl";
import { createHomeShortcutRepository } from "@/features/home/shortcut/data/repository/homeShortcut.repository.impl";
import { createEnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase.impl";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { createGetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createActivateProfileContextUseCase } from "@/features/workspace/activeProfile/useCase/activateProfileContext.useCase.impl";
import ProfileSelectionScreen from "../ui/ProfileSelectionScreen";
import { createActivateSelectedProfileUseCase } from "../useCase/activateSelectedProfile.useCase.impl";
import { useProfileSelectionViewModel } from "../viewModel/profileSelection.viewModel.impl";

type Params = {
  database: Database;
  onActivated: () => void;
  onCreateBusiness: () => void;
};

export const createProfileSelectionScreenFactory = ({
  database,
  onActivated,
  onCreateBusiness,
}: Params) => {
  return function ProfileSelectionScreenFactory(): React.JSX.Element {
    const getCurrentAuthSessionUseCase = React.useMemo(() => {
      const localDataSource = createLocalAuthSessionDataSource(database);
      const repository = createAuthSessionRepository(localDataSource);

      return createGetCurrentAuthSessionUseCase(repository);
    }, []);

    const profileRepository = React.useMemo(() => {
      const localDataSource = createLocalProfileDataSource(database);
      return createProfileRepository(localDataSource);
    }, []);

    const getProfilesByAccountIdUseCase = React.useMemo(
      () => createGetProfilesByAccountIdUseCase(profileRepository),
      [profileRepository],
    );

    const setActiveProfileUseCase = React.useMemo(
      () => createSetActiveProfileUseCase(profileRepository),
      [profileRepository],
    );

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

    const activateSelectedProfileUseCase = React.useMemo(() => {
      return createActivateSelectedProfileUseCase({
        activateProfileContextUseCase: createActivateProfileContextUseCase({
          setActiveProfileUseCase,
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
        }),
      });
    }, [
      activeProfileRepository,
      appSettingUseCases,
      financeAccountRepository,
      homeShortcutRepository,
      setActiveProfileUseCase,
    ]);

    const viewModel = useProfileSelectionViewModel({
      getCurrentAuthSessionUseCase,
      getProfilesByAccountIdUseCase,
      activateSelectedProfileUseCase,
      onActivated,
      onCreateBusiness,
    });

    return <ProfileSelectionScreen viewModel={viewModel} />;
  };
};
