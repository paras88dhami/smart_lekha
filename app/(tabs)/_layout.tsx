import React from "react";
import { Redirect, Tabs } from "expo-router";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createValidateCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/validateCurrentAuthSession.useCase.impl";
import KhataBottomTabBar from "@/shared/components/ui/KhataBottomTabBar";
import { database } from "@/src/database/database";

export default function TabsLayout(): React.JSX.Element {
  const [isReady, setIsReady] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const validateCurrentAuthSessionUseCase = React.useMemo(() => {
    const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
    const authSessionRepository = createAuthSessionRepository(
      localAuthSessionDataSource,
    );

    return createValidateCurrentAuthSessionUseCase(authSessionRepository);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const loadAuthState = async (): Promise<void> => {
      const sessionResult = await validateCurrentAuthSessionUseCase.execute();
      const hasVerifiedSession = Boolean(
        sessionResult.success &&
          sessionResult.value?.isLoggedIn &&
          sessionResult.value?.isVerified &&
          sessionResult.value?.accountId,
      );

      if (!isMounted) {
        return;
      }

      setIsAuthenticated(hasVerifiedSession);
      setIsReady(true);
    };

    void loadAuthState();

    return () => {
      isMounted = false;
    };
  }, [validateCurrentAuthSessionUseCase]);

  if (!isReady) {
    return <React.Fragment />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/language" />;
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

