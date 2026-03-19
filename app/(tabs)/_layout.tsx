import React from "react";
import { Redirect, Tabs } from "expo-router";
import { createLocalAuthSessionDataSource } from "@/features/auth/session/data/dataSource/localAuthSession.datasource.impl";
import { createAuthSessionRepository } from "@/features/auth/session/data/repository/authSession.repository.impl";
import { createGetCurrentAuthSessionUseCase } from "@/features/auth/session/useCase/getCurrentAuthSession.useCase.impl";
import KhataBottomTabBar from "@/shared/components/ui/KhataBottomTabBar";
import { database } from "@/src/database/database";

export default function TabsLayout(): React.JSX.Element {
  const [isReady, setIsReady] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadAuthState = async (): Promise<void> => {
      const localAuthSessionDataSource = createLocalAuthSessionDataSource(database);
      const authSessionRepository = createAuthSessionRepository(
        localAuthSessionDataSource,
      );
      const getCurrentAuthSessionUseCase =
        createGetCurrentAuthSessionUseCase(authSessionRepository);
      const sessionResult = await getCurrentAuthSessionUseCase.execute();
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
  }, []);

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
    </Tabs>
  );
}
