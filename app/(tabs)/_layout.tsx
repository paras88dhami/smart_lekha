import React from "react";
import { Redirect, Tabs } from "expo-router";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { resolveAccessibleAuthSession } from "@/features/auth/session/utils/localAccessSession";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import { createValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase.impl";
import KhataBottomTabBar from "@/shared/components/ui/KhataBottomTabBar";
import { database } from "@/src/database/database";

export default function TabsLayout(): React.JSX.Element {
  const [isReady, setIsReady] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

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

  React.useEffect(() => {
    let isMounted = true;

    const loadAuthState = async (): Promise<void> => {
      const session = await resolveAccessibleAuthSession({
        getCurrentAuthSessionUseCase,
        validateCurrentAuthSessionUseCase,
      });

      if (!isMounted) {
        return;
      }

      setIsAuthenticated(Boolean(session));
      setIsReady(true);
    };

    void loadAuthState();

    return () => {
      isMounted = false;
    };
  }, [getCurrentAuthSessionUseCase, validateCurrentAuthSessionUseCase]);

  if (!isReady) {
    return <React.Fragment />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      tabBar={(props) => <KhataBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="inventory" />
      <Tabs.Screen name="more" />
      <Tabs.Screen name="quick-pos" options={{ href: null }} />
    </Tabs>
  );
}

