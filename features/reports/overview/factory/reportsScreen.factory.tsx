import React from "react";
import type { Database } from "@nozbe/watermelondb";
import ReportsScreen from "../ui/ReportsScreen";
import { createReportsDependencies } from "./createReportsDependencies";
import { useReportsViewModel } from "../viewModel/reports.viewModel.impl";

type Params = {
  database: Database;
};

export const createReportsScreenFactory = ({ database }: Params) => {
  return function ReportsScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => createReportsDependencies({ database }), []);
    const viewModel = useReportsViewModel(dependencies);
    return <ReportsScreen viewModel={viewModel} />;
  };
};
