import React from "react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { createProfileTypeSelectionScreenFactory } from "@/features/auth/profileTypeSelection/factory/profileTypeSelectionScreen.factory";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { database } from "@/src/database/database";

export default function SelectProfileRoute(): React.JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<{ accountId?: string }>();
  const accountIdParam =
    typeof params.accountId === "string" ? params.accountId.trim() : "";
  const [isGuardReady, setIsGuardReady] = React.useState(false);
  const [isGuardAllowed, setIsGuardAllowed] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const validateAccess = async (): Promise<void> => {
      if (!accountIdParam) {
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
          sessionResult.value?.accountId === accountIdParam,
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
  }, [accountIdParam]);

  const Screen = React.useMemo(
    () =>
      createProfileTypeSelectionScreenFactory({
        database,
        accountId: accountIdParam,
        onContinue: () => {
          router.push("/(tabs)/home");
        },
        onClose: () => router.back(),
      }),
    [accountIdParam, router],
  );

  if (!isGuardReady) {
    return <React.Fragment />;
  }

  if (!isGuardAllowed) {
    return <Redirect href="/(auth)/phone-auth" />;
  }

  return <Screen />;
}