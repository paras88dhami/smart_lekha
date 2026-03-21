import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createLocalBusinessCategoryDataSource } from "../../businessCategory/data/dataSource/localBusinessCategory.dataSource.impl";
import { createBusinessCategoryRepository } from "../../businessCategory/data/repository/businessCategory.repository.impl";
import { createGetActiveBusinessCategoriesUseCase } from "../../businessCategory/useCase/getActiveBusinessCategories.useCase.impl";
import { createLocalProfileDataSource } from "../../profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "../../profile/data/repository/profile.repository.impl";
import { createCreateProfileUseCase } from "../../profile/useCase/createProfile.useCase.impl";
import { createCreateProfileWithContextUseCase } from "../../profile/useCase/createProfileWithContext.useCase.impl";
import { createGetProfilesByAccountIdUseCase } from "../../profile/useCase/getProfilesByAccountId.useCase.impl";
import { createSetActiveProfileUseCase } from "../../profile/useCase/setActiveProfile.useCase.impl";
import { createLocalAuthSessionDataSource } from "../../session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "../../session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "../../session/useCase/getCurrentAuthSession.useCase.impl";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
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
import { createActivateProfileContextUseCase } from "@/features/workspace/activeProfile/useCase/activateProfileContext.useCase.impl";
import type { ProfileTypeSelectionMode } from "../types/types";
import ProfileTypeSelectionScreen from "../ui/ProfileTypeSelectionScreen";
import { useProfileTypeSelectionViewModel } from "../viewModel/profileTypeSelection.viewModel.impl";

type Params = {
  database: Database;
  accountId: string | string[] | undefined;
  selectionMode?: string | string[];
  onContinue: () => void;
  onClose: () => void;
  onInvalidAccess?: () => React.JSX.Element;
};

type CreateProfileTypeSelectionScreenParams = {
  database: Database;
  accountId: string;
  selectionMode: ProfileTypeSelectionMode;
  onContinue: () => void;
  onClose: () => void;
};

const readStringParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }

  return typeof value === "string" ? value : "";
};

const parseSelectionMode = (
  value: string | string[] | undefined,
): ProfileTypeSelectionMode => {
  const normalizedValue = readStringParam(value).trim().toLowerCase();

  return normalizedValue === "select-existing" ? "select-existing" : "create";
};

const createProfileTypeSelectionScreen = ({
  database,
  accountId,
  selectionMode,
  onContinue,
  onClose,
}: CreateProfileTypeSelectionScreenParams): React.ComponentType => {
  return function ProfileTypeSelectionFactory(): React.JSX.Element {
    const profileRepository = React.useMemo(() => {
      const profileDataSource = createLocalProfileDataSource(database);
      return createProfileRepository(profileDataSource);
    }, []);

    const businessCategoryRepository = React.useMemo(() => {
      const businessCategoryDataSource =
        createLocalBusinessCategoryDataSource(database);
      return createBusinessCategoryRepository(businessCategoryDataSource);
    }, []);

    const createProfileUseCase = React.useMemo(
      () => createCreateProfileUseCase(profileRepository),
      [profileRepository],
    );
    const appSettingUseCases = React.useMemo(
      () => createAppSettingUseCases(database),
      [],
    );
    const financeAccountRepository = React.useMemo(() => {
      return createFinanceAccountRepository(
        createLocalFinanceAccountDataSource(database),
      );
    }, []);
    const homeShortcutRepository = React.useMemo(() => {
      return createHomeShortcutRepository(
        createLocalHomeShortcutDataSource(database),
      );
    }, []);
    const activeProfileRepository = React.useMemo(() => {
      return createActiveProfileRepository(
        createLocalActiveProfileDataSource(database),
      );
    }, []);
    const getActiveAccountUseCase = React.useMemo(() => {
      return createGetActiveAccountUseCase({
        getActiveProfileUseCase:
          createGetActiveProfileUseCase(activeProfileRepository),
        getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
        getFinanceAccountsByProfileUseCase:
          createGetFinanceAccountsByProfileUseCase(financeAccountRepository),
        getPrimaryFinanceAccountUseCase:
          createGetPrimaryFinanceAccountUseCase(financeAccountRepository),
        setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
      });
    }, [
      activeProfileRepository,
      appSettingUseCases,
      financeAccountRepository,
    ]);
    const createProfileWithContextUseCase = React.useMemo(() => {
      return createCreateProfileWithContextUseCase({
        createProfileUseCase,
        setActiveProfileIdUseCase: appSettingUseCases.setActiveProfileIdUseCase,
        clearActiveAccountIdUseCase:
          appSettingUseCases.clearActiveAccountIdUseCase,
        ensureDefaultFinanceAccountsUseCase:
          createEnsureDefaultFinanceAccountsUseCase(financeAccountRepository),
        ensureDefaultHomeShortcutsUseCase:
          createEnsureDefaultHomeShortcutsUseCase(homeShortcutRepository),
        getActiveAccountUseCase,
      });
    }, [
      appSettingUseCases,
      createProfileUseCase,
      financeAccountRepository,
      getActiveAccountUseCase,
      homeShortcutRepository,
    ]);

    const getProfilesByAccountIdUseCase = React.useMemo(
      () => createGetProfilesByAccountIdUseCase(profileRepository),
      [profileRepository],
    );

    const setActiveProfileUseCase = React.useMemo(
      () => createSetActiveProfileUseCase(profileRepository),
      [profileRepository],
    );
    const activateProfileContextUseCase = React.useMemo(() => {
      return createActivateProfileContextUseCase({
        setActiveProfileUseCase,
        setActiveProfileIdUseCase: appSettingUseCases.setActiveProfileIdUseCase,
        clearActiveAccountIdUseCase:
          appSettingUseCases.clearActiveAccountIdUseCase,
        ensureDefaultFinanceAccountsUseCase:
          createEnsureDefaultFinanceAccountsUseCase(financeAccountRepository),
        ensureDefaultHomeShortcutsUseCase:
          createEnsureDefaultHomeShortcutsUseCase(homeShortcutRepository),
        getActiveAccountUseCase,
      });
    }, [
      appSettingUseCases,
      financeAccountRepository,
      getActiveAccountUseCase,
      homeShortcutRepository,
      setActiveProfileUseCase,
    ]);
    const getActiveBusinessCategoriesUseCase = React.useMemo(
      () => createGetActiveBusinessCategoriesUseCase(businessCategoryRepository),
      [businessCategoryRepository],
    );

    const viewModel = useProfileTypeSelectionViewModel({
      accountId,
      mode: selectionMode,
      createProfileWithContextUseCase,
      getActiveBusinessCategoriesUseCase,
      getProfilesByAccountIdUseCase,
      activateProfileContextUseCase,
      onContinue,
      onClose,
    });

    return <ProfileTypeSelectionScreen viewModel={viewModel} />;
  };
};

export const createProfileTypeSelectionScreenFactory = ({
  database,
  accountId,
  selectionMode,
  onContinue,
  onClose,
  onInvalidAccess,
}: Params) => {
  return function SelectProfileRouteScreenFactory(): React.JSX.Element {
    const resolvedAccountId = readStringParam(accountId).trim();
    const resolvedSelectionMode = parseSelectionMode(selectionMode);
    const [isGuardReady, setIsGuardReady] = React.useState(!onInvalidAccess);
    const [isGuardAllowed, setIsGuardAllowed] = React.useState(!onInvalidAccess);

    React.useEffect(() => {
      if (!onInvalidAccess) {
        setIsGuardReady(true);
        setIsGuardAllowed(true);
        return;
      }

      let isMounted = true;

      const validateAccess = async (): Promise<void> => {
        if (!resolvedAccountId) {
          if (isMounted) {
            setIsGuardAllowed(false);
            setIsGuardReady(true);
          }
          return;
        }

        const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
        const authSessionRepository = createAuthSessionRepository(
          localAuthSessionDataSource,
        );
        const getCurrentAuthSessionUseCase =
          createGetCurrentAuthSessionUseCase(authSessionRepository);
        const sessionResult = await getCurrentAuthSessionUseCase.execute();
        const hasValidSession = Boolean(
          sessionResult.success &&
            sessionResult.value?.isLoggedIn &&
            sessionResult.value?.isVerified &&
            sessionResult.value?.accountId === resolvedAccountId,
        );

        if (!isMounted) {
          return;
        }

        setIsGuardAllowed(hasValidSession);
        setIsGuardReady(true);
      };

      void validateAccess();

      return () => {
        isMounted = false;
      };
    }, [resolvedAccountId]);

    const Screen = React.useMemo(
      () =>
        createProfileTypeSelectionScreen({
          database,
          accountId: resolvedAccountId,
          selectionMode: resolvedSelectionMode,
          onContinue,
          onClose,
        }),
      [resolvedAccountId, resolvedSelectionMode],
    );

    if (onInvalidAccess) {
      if (!isGuardReady) {
        return <React.Fragment />;
      }

      if (!isGuardAllowed) {
        return onInvalidAccess();
      }
    }

    return <Screen />;
  };
};
