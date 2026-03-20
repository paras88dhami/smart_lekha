import type { Database } from "@nozbe/watermelondb";
import React from "react";
import EditShortcutsScreen from "../ui/EditShortcutsScreen";
import { useEditShortcutsViewModel } from "../viewModel/editShortcuts.viewModel.impl";
import { createEditShortcutsDependencies } from "./createEditShortcutsDependencies";

type Params = {
  database: Database;
};

export const createEditShortcutsScreenFactory = ({
  database,
}: Params): () => React.JSX.Element => {
  return function EditShortcutsScreenFactory(): React.JSX.Element {
    const dependencies = React.useMemo(() => {
      return createEditShortcutsDependencies({ database });
    }, []);

    const viewModel = useEditShortcutsViewModel({
      loadEditShortcutsUseCase: dependencies.loadEditShortcutsUseCase,
      saveEditShortcutsUseCase: dependencies.saveEditShortcutsUseCase,
    });

    return <EditShortcutsScreen viewModel={viewModel} />;
  };
};
