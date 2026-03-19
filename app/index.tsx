import React from "react";
import { Redirect } from "expo-router";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase.impl";
import { database } from "@/src/database/database";

export default function IndexScreen(): React.JSX.Element {
  const [redirectPath, setRedirectPath] = React.useState<
    "/(tabs)/home" | "/(auth)/language" | null
  >(null);

  const validateCurrentAuthSessionUseCase = React.useMemo(() => {
    const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
    const authSessionRepository = createAuthSessionRepository(
      localAuthSessionDataSource,
    );

    return createValidateCurrentAuthSessionUseCase(authSessionRepository);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const resolveInitialRoute = async (): Promise<void> => {
      const sessionResult = await validateCurrentAuthSessionUseCase.execute();
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
  }, [validateCurrentAuthSessionUseCase]);

  if (!redirectPath) {
    return <React.Fragment />;
  }

  return <Redirect href={redirectPath} />;
}
