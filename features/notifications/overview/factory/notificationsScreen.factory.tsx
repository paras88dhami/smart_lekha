import React from "react";
import type { Database } from "@nozbe/watermelondb";
import NotificationsScreen from "../ui/NotificationsScreen";
import { createNotificationsDependencies } from "./createNotificationsDependencies";
import { useNotificationsViewModel } from "../viewModel/notifications.viewModel.impl";

type Params = {
  database: Database;
};

export const createNotificationsScreenFactory = ({ database }: Params) => {
  return function NotificationsScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(
      () => createNotificationsDependencies({ database }),
      [],
    );
    const viewModel = useNotificationsViewModel(dependencies);
    return <NotificationsScreen viewModel={viewModel} />;
  };
};
