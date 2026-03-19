import React from "react";
import { createReportsScreenFactory } from "@/features/reports/list/factory/reportsScreen.factory";
import { database } from "@/src/database/database";

export default function ReportsRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createReportsScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
