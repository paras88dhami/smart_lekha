import type { Database } from "@nozbe/watermelondb";
import React, { useMemo } from "react";
import type { FeatureHubItem } from "../types/types";
import MoreScreen from "../ui/MoreScreen";
import { createMoreDependencies } from "./createMoreDependencies";
import { useMoreViewModel } from "../viewModel/more.viewModel.impl";

type Params = {
  database: Database;
  features: FeatureHubItem[];
  onOpenFeature: (route: string) => void;
  onLoggedOut: () => void;
};

export const createMoreScreenFactory = ({
  database,
  features,
  onOpenFeature,
  onLoggedOut,
}: Params) => {
  return function MoreScreenFactory(): React.JSX.Element {
    const dependencies = useMemo(() => createMoreDependencies({ database, features }), []);

    const viewModel = useMoreViewModel({
      ...dependencies,
      onOpenFeature,
      onLoggedOut,
    });

    return <MoreScreen viewModel={viewModel} />;
  };
};
