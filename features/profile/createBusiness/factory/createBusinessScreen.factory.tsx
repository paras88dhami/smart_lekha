import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createLocalBusinessCategoryDataSource } from "@/features/auth/businessCategory/data/dataSource/localBusinessCategory.dataSource.impl";
import { createBusinessCategoryRepository } from "@/features/auth/businessCategory/data/repository/businessCategory.repository.impl";
import { createGetActiveBusinessCategoriesUseCase } from "@/features/auth/businessCategory/useCase/getActiveBusinessCategories.useCase.impl";
import { createLocalProfileDataSource } from "@/features/auth/profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "@/features/auth/profile/data/repository/profile.repository.impl";
import { createCreateProfileUseCase } from "@/features/auth/profile/useCase/createProfile.useCase.impl";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
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
    }, [database]);

    const getActiveBusinessCategoriesUseCase = React.useMemo(() => {
      const localDataSource = createLocalBusinessCategoryDataSource(database);
      const repository = createBusinessCategoryRepository(localDataSource);

      return createGetActiveBusinessCategoriesUseCase(repository);
    }, [database]);

    const createProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalProfileDataSource(database);
      const repository = createProfileRepository(localDataSource);

      return createCreateProfileUseCase(repository);
    }, [database]);

    const viewModel = useCreateBusinessViewModel({
      getCurrentAuthSessionUseCase,
      getActiveBusinessCategoriesUseCase,
      createProfileUseCase,
      onCreated,
    });

    return <CreateBusinessScreen viewModel={viewModel} />;
  };
};
