import React from "react";
import type { Database } from "@nozbe/watermelondb";
import DownloadDataScreen from "../ui/DownloadDataScreen";
import { createDownloadDataDependencies } from "./createDownloadDataDependencies";
import { useDownloadDataViewModel } from "../viewModel/downloadData.viewModel.impl";

type Params = {
  database: Database;
};

export const createDownloadDataScreenFactory = ({ database }: Params) => {
  return function DownloadDataScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => createDownloadDataDependencies({ database }), []);
    const viewModel = useDownloadDataViewModel(dependencies);
    return <DownloadDataScreen viewModel={viewModel} />;
  };
};
