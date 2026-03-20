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
          router.push("/profile-selection");
        },
        onEditShortcutsPress: () => {
          router.push("/edit-shortcuts");
        },
        onMyAccountsPress: () => {
          router.push("/cash-bank");
        },
        onStatementPress: () => {
          router.push("/reports");
        },
        onEsewaPress: () => {
          router.push("/quick-entry");
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
          router.push("/notifications");
        },
      }),
    [],
  );

  return <Screen />;
}
