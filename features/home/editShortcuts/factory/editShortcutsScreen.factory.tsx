import type { Database } from "@nozbe/watermelondb";
import React from "react";
import { createLocalHomeShortcutDataSource } from "@/features/home/shortcut/data/dataSource/localHomeShortcut.dataSource.impl";
import { createHomeShortcutRepository } from "@/features/home/shortcut/data/repository/homeShortcut.repository.impl";
import { createEnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase.impl";
import { createGetAllHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getAllHomeShortcuts.useCase.impl";
import { createSaveHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/saveHomeShortcuts.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import EditShortcutsScreen from "../ui/EditShortcutsScreen";
import { useEditShortcutsViewModel } from "../viewModel/editShortcuts.viewModel.impl";

type Params = {
  database: Database;
};

export const createEditShortcutsScreenFactory = ({
  database,
}: Params) => {
  return function EditShortcutsScreenFactory(): React.JSX.Element {
    const getActiveProfileUseCase = React.useMemo(() => {
      const localDataSource = createLocalActiveProfileDataSource(database);
      const repository = createActiveProfileRepository(localDataSource);

      return createGetActiveProfileUseCase(repository);
    }, [database]);

    const homeShortcutRepository = React.useMemo(() => {
      const localDataSource = createLocalHomeShortcutDataSource(database);
      return createHomeShortcutRepository(localDataSource);
    }, [database]);

    const ensureDefaultHomeShortcutsUseCase = React.useMemo(
      () => createEnsureDefaultHomeShortcutsUseCase(homeShortcutRepository),
      [homeShortcutRepository],
    );

    const getAllHomeShortcutsUseCase = React.useMemo(
      () => createGetAllHomeShortcutsUseCase(homeShortcutRepository),
      [homeShortcutRepository],
    );

    const saveHomeShortcutsUseCase = React.useMemo(
      () => createSaveHomeShortcutsUseCase(homeShortcutRepository),
      [homeShortcutRepository],
    );

    const viewModel = useEditShortcutsViewModel({
      getActiveProfileUseCase,
      ensureDefaultHomeShortcutsUseCase,
      getAllHomeShortcutsUseCase,
      saveHomeShortcutsUseCase,
    });

    return <EditShortcutsScreen viewModel={viewModel} />;
  };
};
