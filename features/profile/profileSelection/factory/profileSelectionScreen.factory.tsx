import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createLocalProfileDataSource } from "@/features/auth/profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "@/features/auth/profile/data/repository/profile.repository.impl";
import { createGetProfilesByAccountIdUseCase } from "@/features/auth/profile/useCase/getProfilesByAccountId.useCase.impl";
import { createSetActiveProfileUseCase } from "@/features/auth/profile/useCase/setActiveProfile.useCase.impl";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import ProfileSelectionScreen from "../ui/ProfileSelectionScreen";
import { useProfileSelectionViewModel } from "../viewModel/profileSelection.viewModel.impl";

type Params = {
  database: Database;
  onCreateBusiness: () => void;
};

export const createProfileSelectionScreenFactory = ({
  database,
  onCreateBusiness,
}: Params) => {
  return function ProfileSelectionScreenFactory(): React.JSX.Element {
    const getCurrentAuthSessionUseCase = React.useMemo(() => {
      const localDataSource = createLocalAuthSessionDataSource(database);
      const repository = createAuthSessionRepository(localDataSource);

      return createGetCurrentAuthSessionUseCase(repository);
    }, [database]);

    const profileRepository = React.useMemo(() => {
      const localDataSource = createLocalProfileDataSource(database);
      return createProfileRepository(localDataSource);
    }, [database]);

    const getProfilesByAccountIdUseCase = React.useMemo(
      () => createGetProfilesByAccountIdUseCase(profileRepository),
      [profileRepository],
    );

    const setActiveProfileUseCase = React.useMemo(
      () => createSetActiveProfileUseCase(profileRepository),
      [profileRepository],
    );

    const viewModel = useProfileSelectionViewModel({
      getCurrentAuthSessionUseCase,
      getProfilesByAccountIdUseCase,
      setActiveProfileUseCase,
      onCreateBusiness,
    });

    return <ProfileSelectionScreen viewModel={viewModel} />;
  };
};
