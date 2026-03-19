import React from "react";
import { Redirect } from "expo-router";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { database } from "@/src/database/database";

export default function IndexScreen(): React.JSX.Element {
  const [redirectPath, setRedirectPath] = React.useState<
    "/(tabs)/home" | "/(auth)/language" | null
  >(null);

  React.useEffect(() => {
    let isMounted = true;

    const resolveInitialRoute = async (): Promise<void> => {
      const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
      const authSessionRepository = createAuthSessionRepository(
        localAuthSessionDataSource,
      );
      const getCurrentAuthSessionUseCase =
        createGetCurrentAuthSessionUseCase(authSessionRepository);
      const sessionResult = await getCurrentAuthSessionUseCase.execute();
      const hasActiveVerifiedSession = Boolean(
        sessionResult.success &&
          sessionResult.value?.isLoggedIn &&
          sessionResult.value?.isVerified &&
          sessionResult.value?.accountId,
      );

      if (!isMounted) {
        return;
      }

      setRedirectPath(
        hasActiveVerifiedSession ? "/(tabs)/home" : "/(auth)/language",
      );
    };

    void resolveInitialRoute();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!redirectPath) {
    return <React.Fragment />;
  }

  return <Redirect href={redirectPath} />;
}
