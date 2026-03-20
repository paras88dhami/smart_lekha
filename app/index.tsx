import React from "react";
import { Redirect } from "expo-router";
import { createLocalProfileDataSource } from "@/features/auth/profile/data/dataSource/profile.datasource.impl";
import { createProfileRepository } from "@/features/auth/profile/data/repository/profile.repository.impl";
import { createGetProfilesByAccountIdUseCase } from "@/features/auth/profile/useCase/getProfilesByAccountId.useCase.impl";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { resolveAccessibleAuthSession } from "@/features/auth/session/utils/localAccessSession";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { createValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { database } from "@/src/database/database";

export default function IndexScreen(): React.JSX.Element {
  const [redirectPath, setRedirectPath] = React.useState<
    "/(tabs)/home" | "/(auth)/language" | "/profile-selection" | "/create-business" | null
  >(null);

  const authSessionRepository = React.useMemo(() => {
    const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
    return createAuthSessionRepository(localAuthSessionDataSource);
  }, []);

  const getCurrentAuthSessionUseCase = React.useMemo(
    () => createGetCurrentAuthSessionUseCase(authSessionRepository),
    [authSessionRepository],
  );

  const validateCurrentAuthSessionUseCase = React.useMemo(
    () => createValidateCurrentAuthSessionUseCase(authSessionRepository),
    [authSessionRepository],
  );

  const getProfilesByAccountIdUseCase = React.useMemo(() => {
    const localProfileDataSource = createLocalProfileDataSource(database);
    const profileRepository = createProfileRepository(localProfileDataSource);

    return createGetProfilesByAccountIdUseCase(profileRepository);
  }, []);

  const getActiveProfileUseCase = React.useMemo(() => {
    const localActiveProfileDataSource = createLocalActiveProfileDataSource(database);
    const activeProfileRepository = createActiveProfileRepository(
      localActiveProfileDataSource,
    );

    return createGetActiveProfileUseCase(activeProfileRepository);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const resolveInitialRoute = async (): Promise<void> => {
      const session = await resolveAccessibleAuthSession({
        getCurrentAuthSessionUseCase,
        validateCurrentAuthSessionUseCase,
      });

      if (!isMounted) {
        return;
      }

      if (!session?.accountId) {
        setRedirectPath("/(auth)/language");
        return;
      }

      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (
        activeProfileResult.success &&
        activeProfileResult.value &&
        activeProfileResult.value.accountId === session.accountId
      ) {
        setRedirectPath("/(tabs)/home");
        return;
      }

      const profilesResult = await getProfilesByAccountIdUseCase.execute(session.accountId);

      if (profilesResult.success && profilesResult.value.length > 0) {
        setRedirectPath("/profile-selection");
        return;
      }

      setRedirectPath("/create-business");
    };

    void resolveInitialRoute();

    return () => {
      isMounted = false;
    };
  }, [
    getActiveProfileUseCase,
    getCurrentAuthSessionUseCase,
    getProfilesByAccountIdUseCase,
    validateCurrentAuthSessionUseCase,
  ]);

  if (!redirectPath) {
    return <React.Fragment />;
  }

  return <Redirect href={redirectPath} />;
}
