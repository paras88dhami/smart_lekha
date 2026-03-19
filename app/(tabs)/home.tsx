import React from "react";
import { router } from "expo-router";
import { createHomeDashboardScreenFactory } from "@/features/home/dashboard/factory/homeDashboardScreen.factory";
import { database } from "@/src/database/database";

export default function HomeRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createHomeDashboardScreenFactory({
        database,
        onMyProfilePress: () => {
          router.push("/(tabs)/more");
        },
        onMyAccountsPress: () => {
          router.push("/(tabs)/transactions");
        },
        onStatementPress: () => {
          router.push("/(tabs)/transactions");
        },
        onEsewaPress: () => {
          router.push("/(tabs)/transactions");
        },
        onQuickPosPress: () => {
          router.push("/(tabs)/quick-pos" as never);
        },
        onSendMoneyPress: () => {
          router.push("/(tabs)/inventory");
        },
        onViewAllTransactionsPress: () => {
          router.push("/(tabs)/transactions");
        },
        onNotificationsPress: () => {
          router.push("/(tabs)/more");
        },
      }),
    [],
  );

  return <Screen />;
}



