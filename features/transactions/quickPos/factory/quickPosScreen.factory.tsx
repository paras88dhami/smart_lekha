import type { Database } from "@nozbe/watermelondb";
import React from "react";
import QuickPosScreen from "../ui/QuickPosScreen";
import { createQuickPosDependencies } from "./createQuickPosDependencies";
import { useQuickPosViewModel } from "../viewModel/quickPos.viewModel.impl";

type Params = {
  database: Database;
};

export const createQuickPosScreenFactory = ({
  database,
}: Params) => {
  return function QuickPosScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => createQuickPosDependencies(database), []);
    const viewModel = useQuickPosViewModel(dependencies);

    return <QuickPosScreen viewModel={viewModel} />;
  };
};
