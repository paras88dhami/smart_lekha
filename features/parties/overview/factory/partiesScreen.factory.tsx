import React from "react";
import type { Database } from "@nozbe/watermelondb";
import PartiesScreen from "../ui/PartiesScreen";
import { createPartiesDependencies } from "./createPartiesDependencies";
import { usePartiesViewModel } from "../viewModel/parties.viewModel.impl";

type Params = {
  database: Database;
};

export const createPartiesScreenFactory = ({ database }: Params) => {
  return function PartiesScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => createPartiesDependencies({ database }), []);
    const viewModel = usePartiesViewModel(dependencies);
    return <PartiesScreen viewModel={viewModel} />;
  };
};
