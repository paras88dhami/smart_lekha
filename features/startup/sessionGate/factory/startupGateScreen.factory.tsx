import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createLocalProfileDataSource } from "@/features/auth/profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "@/features/auth/profile/data/repository/profile.repository.impl";
import { createGetProfilesByAccountIdUseCase } from "@/features/auth/profile/useCase/getProfilesByAccountId.useCase.impl";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { createValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase.impl";
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
import StartupGateScreen from "../ui/StartupGateScreen";
import { createResolveStartupDestinationUseCase } from "../useCase/resolveStartupDestination.useCase.impl";
import { useStartupGateViewModel } from "../viewModel/startupGate.viewModel.impl";

type Params = {
  database: Database;
};

export const createStartupGateScreenFactory = ({ database }: Params) => {
  return function StartupGateScreenFactory(): React.JSX.Element {
    const appSettingUseCases = React.useMemo(
      () => createAppSettingUseCases(database),
      [],
    );
    const authSessionRepository = React.useMemo(() => {
      return createAuthSessionRepository(createLocalAuthSessionDataSource(database));
    }, []);
    const profileRepository = React.useMemo(() => {
      return createProfileRepository(createLocalProfileDataSource(database));
    }, []);
    const activeProfileRepository = React.useMemo(() => {
      return createActiveProfileRepository(createLocalActiveProfileDataSource(database));
    }, []);
    const financeAccountRepository = React.useMemo(() => {
      return createFinanceAccountRepository(createLocalFinanceAccountDataSource(database));
    }, []);
    const homeShortcutRepository = React.useMemo(() => {
      return createHomeShortcutRepository(createLocalHomeShortcutDataSource(database));
    }, []);

    const resolveStartupDestinationUseCase = React.useMemo(() => {
      return createResolveStartupDestinationUseCase({
        createDefaultAppSettingUseCase:
          appSettingUseCases.createDefaultAppSettingUseCase,
        getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
        getCurrentAuthSessionUseCase:
          createGetCurrentAuthSessionUseCase(authSessionRepository),
        validateCurrentAuthSessionUseCase:
          createValidateCurrentAuthSessionUseCase(authSessionRepository),
        getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
        getProfilesByAccountIdUseCase:
          createGetProfilesByAccountIdUseCase(profileRepository),
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
        clearActiveProfileIdUseCase:
          appSettingUseCases.clearActiveProfileIdUseCase,
        clearActiveAccountIdUseCase:
          appSettingUseCases.clearActiveAccountIdUseCase,
      });
    }, [
      activeProfileRepository,
      appSettingUseCases,
      authSessionRepository,
      financeAccountRepository,
      homeShortcutRepository,
      profileRepository,
    ]);

    const viewModel = useStartupGateViewModel({
      resolveStartupDestinationUseCase,
    });

    return <StartupGateScreen viewModel={viewModel} />;
  };
};
