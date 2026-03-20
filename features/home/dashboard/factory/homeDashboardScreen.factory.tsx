import type { Database } from "@nozbe/watermelondb";
import React from "react";
import HomeDashboardScreen from "../ui/HomeDashboardScreen";
import { useHomeDashboardViewModel } from "../viewModel/homeDashboard.viewModel.impl";
import { createHomeDashboardDependencies } from "./createHomeDashboardDependencies";

type Params = {
  database: Database;
  onMyProfilePress: () => void;
  onEditShortcutsPress: () => void;
  onMyAccountsPress: () => void;
  onStatementPress: () => void;
  onEsewaPress: () => void;
  onQuickPosPress: () => void;
  onSendMoneyPress: () => void;
  onViewAllTransactionsPress: () => void;
  onNotificationsPress: () => void;
};

export const createHomeDashboardScreenFactory = ({
  database,
  onMyProfilePress,
  onEditShortcutsPress,
  onMyAccountsPress,
  onStatementPress,
  onEsewaPress,
  onQuickPosPress,
  onSendMoneyPress,
  onViewAllTransactionsPress,
  onNotificationsPress,
}: Params): () => React.JSX.Element => {
  return function HomeDashboardScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => {
      return createHomeDashboardDependencies({ database });
    }, []);

    const viewModel = useHomeDashboardViewModel({
      loadHomeDashboardUseCase: dependencies.loadHomeDashboardUseCase,
      onMyProfilePress,
      onEditShortcutsPress,
      onMyAccountsPress,
      onStatementPress,
      onEsewaPress,
      onQuickPosPress,
      onSendMoneyPress,
      onViewAllTransactionsPress,
      onNotificationsPress,
    });

    return <HomeDashboardScreen viewModel={viewModel} />;
  };
};
