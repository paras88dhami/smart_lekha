import React from "react";
import { createNotificationsScreenFactory } from "@/features/notifications/list/factory/notificationsScreen.factory";
import { database } from "@/src/database/database";

export default function NotificationsRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createNotificationsScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
