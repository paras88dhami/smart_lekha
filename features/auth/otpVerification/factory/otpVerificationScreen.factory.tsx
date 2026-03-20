import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { isSupportedLanguageCode } from "@/shared/i18n/resources";
import { createLocalProfileDataSource } from "../../profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "../../profile/data/repository/profile.repository.impl";
import { createGetProfilesByAccountIdUseCase } from "../../profile/useCase/getProfilesByAccountId.useCase.impl";
import { createSetActiveProfileUseCase } from "../../profile/useCase/setActiveProfile.useCase.impl";
import type { LanguageCodeType } from "../../languageSelection/types/types";
import { createLocalOtpRequestDataSource } from "../../otp/data/dataSource/localOtpRequest.dataSource.impl";
import { createRemoteOtpAuthDataSource } from "../../otp/data/dataSource/remoteOtpAuth.dataSource.impl";
import { createOtpRepository } from "../../otp/data/repository/otp.repository.impl";
import { createRequestOtpUseCase } from "../../otp/useCase/requestOtp.useCase.impl";
import { createVerifyOtpUseCase } from "../../otp/useCase/verifyOtp.useCase.impl";
import {
  CountryIso,
  isCountryIso,
  type CountryIsoType,
} from "../../shared/country.types";
import { createLocalAuthSessionDataSource } from "../../session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "../../session/data/repository/authSession.repository.impl";
import { createUpsertAuthSessionUseCase } from "../../session/useCase/upsertAuthSession.useCase.impl";
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
import type { OtpVerificationResult } from "../types/types";
import { createResolveVerifiedAccountRouteUseCase } from "../useCase/resolveVerifiedAccountRoute.useCase.impl";
import OtpVerificationScreen from "../ui/OtpVerificationScreen";
import { useOtpVerificationViewModel } from "../viewModel/otpVerification.viewModel.impl";

const DEFAULT_OTP_EXPIRES_AFTER_MS = 5 * 60 * 1000;

type RawRouteParams = {
  phoneNumber?: string | string[];
  countryIso?: string | string[];
  countryCode?: string | string[];
  languageCode?: string | string[];
  isExistingUser?: string | string[];
  otpReferenceId?: string | string[];
  otpExpiresAt?: string | string[];
  resendAfterSeconds?: string | string[];
};

type CreateOtpVerificationScreenParams = {
  database: Database;
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  languageCode: LanguageCodeType;
  isExistingUser: boolean;
  otpReferenceId: string;
  otpExpiresAt: number;
  resendAfterSeconds: number;
  onVerified(input: OtpVerificationResult): void;
  onClose(): void;
};

type Params = {
  database: Database;
  routeParams: RawRouteParams;
  onNavigateHome(): void;
  onNavigateCreateProfile(accountId: string): void;
  onNavigateSelectExistingProfile(accountId: string): void;
  onInvalidRoute(): React.JSX.Element;
  onClose(): void;
};

const readStringParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }

  return typeof value === "string" ? value : "";
};

const parsePositiveNumber = (value: string, fallbackValue: number): number => {
  if (!value) {
    return fallbackValue;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallbackValue;
  }

  return parsedValue;
};

const parseLanguageCode = (value: string): LanguageCodeType => {
  if (value && isSupportedLanguageCode(value)) {
    return value;
  }

  return "en";
};

const parseBoolean = (value: string, fallbackValue: boolean): boolean => {
  if (!value) {
    return fallbackValue;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  return fallbackValue;
};

const getDefaultCountryCode = (countryIso: CountryIsoType): string => {
  return countryIso === CountryIso.India ? "+91" : "+977";
};

const createOtpVerificationScreen = ({
  database,
  phoneNumber,
  countryCode,
  countryIso,
  languageCode,
  isExistingUser,
  otpReferenceId,
  otpExpiresAt,
  resendAfterSeconds,
  onVerified,
  onClose,
}: CreateOtpVerificationScreenParams): React.ComponentType => {
  return function OtpVerificationScreenFactory(): React.JSX.Element {
    const otpRepository = React.useMemo(() => {
      const remoteOtpAuthDataSource = createRemoteOtpAuthDataSource();
      const localOtpRequestDataSource = createLocalOtpRequestDataSource(database);

      return createOtpRepository(remoteOtpAuthDataSource, localOtpRequestDataSource);
    }, []);

    const requestOtpUseCase = React.useMemo(
      () => createRequestOtpUseCase(otpRepository),
      [otpRepository],
    );

    const verifyOtpUseCase = React.useMemo(
      () => createVerifyOtpUseCase(otpRepository),
      [otpRepository],
    );

    const authSessionRepository = React.useMemo(() => {
      const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
      return createAuthSessionRepository(localAuthSessionDataSource);
    }, []);

    const upsertAuthSessionUseCase = React.useMemo(
      () => createUpsertAuthSessionUseCase(authSessionRepository),
      [authSessionRepository],
    );

    const viewModel = useOtpVerificationViewModel({
      phoneNumber,
      countryCode,
      countryIso,
      languageCode,
      isExistingUser,
      otpReferenceId,
      otpExpiresAt,
      resendAfterSeconds,
      requestOtpUseCase,
      verifyOtpUseCase,
      upsertAuthSessionUseCase,
      onVerified,
      onClose,
    });

    return <OtpVerificationScreen viewModel={viewModel} />;
  };
};

export const createOtpVerificationScreenFactory = ({
  database,
  routeParams,
  onNavigateHome,
  onNavigateCreateProfile,
  onNavigateSelectExistingProfile,
  onInvalidRoute,
  onClose,
}: Params) => {
  return function OtpVerificationRouteScreenFactory(): React.JSX.Element {
    const phoneNumber = readStringParam(routeParams.phoneNumber).trim();
    const rawCountryIso = readStringParam(routeParams.countryIso);
    const countryIso: CountryIsoType =
      rawCountryIso && isCountryIso(rawCountryIso)
        ? rawCountryIso
        : CountryIso.Nepal;
    const rawCountryCode = readStringParam(routeParams.countryCode).trim();
    const countryCode =
      rawCountryCode.length > 0
        ? rawCountryCode
        : getDefaultCountryCode(countryIso);
    const languageCode = parseLanguageCode(
      readStringParam(routeParams.languageCode),
    );
    const isExistingUser = parseBoolean(
      readStringParam(routeParams.isExistingUser),
      false,
    );
    const otpReferenceId = readStringParam(routeParams.otpReferenceId).trim();
    const otpExpiresAt = parsePositiveNumber(
      readStringParam(routeParams.otpExpiresAt),
      Date.now() + DEFAULT_OTP_EXPIRES_AFTER_MS,
    );
    const resendAfterSeconds = parsePositiveNumber(
      readStringParam(routeParams.resendAfterSeconds),
      30,
    );

    const profileRepository = React.useMemo(() => {
      const profileDataSource = createLocalProfileDataSource(database);
      return createProfileRepository(profileDataSource);
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

    const isResolvingNextRouteRef = React.useRef(false);

    const resolveVerifiedAccountRouteUseCase = React.useMemo(() => {
      return createResolveVerifiedAccountRouteUseCase({
        getProfilesByAccountIdUseCase,
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
      getProfilesByAccountIdUseCase,
      homeShortcutRepository,
      setActiveProfileUseCase,
    ]);

    const handleVerified = React.useCallback(
      async (input: OtpVerificationResult): Promise<void> => {
        if (isResolvingNextRouteRef.current) {
          return;
        }

        isResolvingNextRouteRef.current = true;

        try {
          const result = await resolveVerifiedAccountRouteUseCase.execute({
            accountId: input.accountId,
          });

          if (!result.success) {
            if (input.isExistingUser) {
              onNavigateHome();
              return;
            }

            onNavigateCreateProfile(input.accountId);
            return;
          }

          if (result.value === "home") {
            onNavigateHome();
            return;
          }

          if (result.value === "create_business") {
            onNavigateCreateProfile(input.accountId);
            return;
          }

          onNavigateSelectExistingProfile(input.accountId);
        } finally {
          isResolvingNextRouteRef.current = false;
        }
      },
      [
        resolveVerifiedAccountRouteUseCase,
      ],
    );

    const Screen = React.useMemo(
      () =>
        createOtpVerificationScreen({
          database,
          phoneNumber,
          countryCode,
          countryIso,
          languageCode,
          isExistingUser,
          otpReferenceId,
          otpExpiresAt,
          resendAfterSeconds,
          onVerified: (input) => {
            void handleVerified(input);
          },
          onClose,
        }),
      [
        countryCode,
        countryIso,
        handleVerified,
        isExistingUser,
        languageCode,
        otpExpiresAt,
        otpReferenceId,
        phoneNumber,
        resendAfterSeconds,
      ],
    );

    if (!phoneNumber || !otpReferenceId) {
      return onInvalidRoute();
    }

    return <Screen />;
  };
};
