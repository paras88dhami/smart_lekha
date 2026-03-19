import React from "react";
import { createPartiesScreenFactory } from "@/features/parties/list/factory/partiesScreen.factory";
import { database } from "@/src/database/database";

export default function PartiesRoute(): React.JSX.Element {
  const Screen = React.useMemo(
    () =>
      createPartiesScreenFactory({
        database,
      }),
    [],
  );

  return <Screen />;
}
