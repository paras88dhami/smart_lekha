import React from "react";
import { createStartupGateScreenFactory } from "@/features/startup/sessionGate/factory/startupGateScreen.factory";
import { database } from "@/src/database/database";

export default function IndexScreen(): React.JSX.Element {
  const Screen = React.useMemo(
    () => createStartupGateScreenFactory({ database }),
    [],
  );

  return <Screen />;
}
