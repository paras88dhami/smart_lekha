import type { Database } from "@nozbe/watermelondb";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createClearAuthSessionUseCase } from "@/features/auth/session/useCase/clearAuthSession.useCase.impl";
import type { FeatureHubItem } from "../types/types";
import type { LoadFeatureHubUseCase } from "../useCase/loadFeatureHub.useCase";
import type { LogoutFromFeatureHubUseCase } from "../useCase/logoutFromFeatureHub.useCase";
import { createLoadFeatureHubUseCase } from "../useCase/loadFeatureHub.useCase.impl";
import { createLogoutFromFeatureHubUseCase } from "../useCase/logoutFromFeatureHub.useCase.impl";

type Params = {
  database: Database;
  features: FeatureHubItem[];
};

export type MoreDependencies = {
  loadFeatureHubUseCase: LoadFeatureHubUseCase;
  logoutFromFeatureHubUseCase: LogoutFromFeatureHubUseCase;
};

export const createMoreDependencies = ({
  database,
  features,
}: Params): MoreDependencies => {
  const appSettingUseCases = createAppSettingUseCases(database);
  const authSessionRepository = createAuthSessionRepository(
    createLocalAuthSessionDataSource(database),
  );

  return {
    loadFeatureHubUseCase: createLoadFeatureHubUseCase({ features }),
    logoutFromFeatureHubUseCase: createLogoutFromFeatureHubUseCase({
      clearAuthSessionUseCase: createClearAuthSessionUseCase(authSessionRepository),
      clearActiveProfileIdUseCase: appSettingUseCases.clearActiveProfileIdUseCase,
      clearActiveAccountIdUseCase: appSettingUseCases.clearActiveAccountIdUseCase,
    }),
  };
};
