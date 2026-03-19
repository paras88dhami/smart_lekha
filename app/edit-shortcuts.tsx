import React from "react";
import { createEditShortcutsScreenFactory } from "@/features/home/editShortcuts/factory/editShortcutsScreen.factory";
import { database } from "@/src/database/database";

export default function EditShortcutsRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createEditShortcutsScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
