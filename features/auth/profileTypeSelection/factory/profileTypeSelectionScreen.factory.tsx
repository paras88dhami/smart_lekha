import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { useMemo } from "react";
import { createLocalBusinessCategoryDataSource } from "../../businessCategory/data/dataSource/localBusinessCategory.dataSource.impl";
import { createBusinessCategoryRepository } from "../../businessCategory/data/repository/businessCategory.repository.impl";
import { createGetActiveBusinessCategoriesUseCase } from "../../businessCategory/useCase/getActiveBusinessCategories.useCase.impl";
import { createLocalProfileDataSource } from "../../profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "../../profile/data/repository/profile.repository.impl";
import { createCreateProfileUseCase } from "../../profile/useCase/createProfile.useCase.impl";
import ProfileTypeSelectionScreen from "../ui/ProfileTypeSelectionScreen";
import { useProfileTypeSelectionViewModel } from "../viewModel/profileTypeSelection.viewModel.impl";

type Params = {
  database: Database;
  accountId: string;
  onContinue: () => void;
  onClose: () => void;
};

export const createProfileTypeSelectionScreenFactory = ({
  database,
  accountId,
  onContinue,
  onClose,
}: Params) => {
  return function ProfileTypeSelectionFactory(): React.JSX.Element {
    const profileRepository = useMemo(() => {
      const profileDataSource = createLocalProfileDataSource(database);
      return createProfileRepository(profileDataSource);
    }, []);

    const businessCategoryRepository = useMemo(() => {
      const businessCategoryDataSource =
        createLocalBusinessCategoryDataSource(database);
      return createBusinessCategoryRepository(businessCategoryDataSource);
    }, []);

    const createProfileUseCase = useMemo(
      () => createCreateProfileUseCase(profileRepository),
      [profileRepository],
    );

    const getActiveBusinessCategoriesUseCase = useMemo(
      () => createGetActiveBusinessCategoriesUseCase(businessCategoryRepository),
      [businessCategoryRepository],
    );

    const viewModel = useProfileTypeSelectionViewModel({
      accountId,
      createProfileUseCase,
      getActiveBusinessCategoriesUseCase,
      onContinue,
      onClose,
    });

    return <ProfileTypeSelectionScreen viewModel={viewModel} />;
  };
};
