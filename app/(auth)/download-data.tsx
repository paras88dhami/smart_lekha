import React from "react";
import { createDownloadDataScreenFactory } from "@/features/profile/downloadData/factory/downloadDataScreen.factory";
import { database } from "@/src/database/database";

export default function DownloadDataRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createDownloadDataScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
