import type { Database } from "@nozbe/watermelondb";
import { createLocalHomeShortcutDataSource } from "@/features/home/shortcut/data/dataSource/localHomeShortcut.dataSource.impl";
import { createHomeShortcutRepository } from "@/features/home/shortcut/data/repository/homeShortcut.repository.impl";
import { createEnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase.impl";
import { createGetAllHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getAllHomeShortcuts.useCase.impl";
import { createSaveHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/saveHomeShortcuts.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLoadEditShortcutsUseCase } from "../useCase/loadEditShortcuts.useCase.impl";
import { createSaveEditShortcutsUseCase } from "../useCase/saveEditShortcuts.useCase.impl";
import type { LoadEditShortcutsUseCase } from "../useCase/loadEditShortcuts.useCase";
import type { SaveEditShortcutsUseCase } from "../useCase/saveEditShortcuts.useCase";

type Params = {
  database: Database;
};

export type EditShortcutsDependencies = {
  loadEditShortcutsUseCase: LoadEditShortcutsUseCase;
  saveEditShortcutsUseCase: SaveEditShortcutsUseCase;
};

export const createEditShortcutsDependencies = ({
  database,
}: Params): EditShortcutsDependencies => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const homeShortcutRepository = createHomeShortcutRepository(
    createLocalHomeShortcutDataSource(database),
  );

  return {
    loadEditShortcutsUseCase: createLoadEditShortcutsUseCase({
      getActiveProfileUseCase: createGetActiveProfileUseCase(activeProfileRepository),
      ensureDefaultHomeShortcutsUseCase: createEnsureDefaultHomeShortcutsUseCase(
        homeShortcutRepository,
      ),
      getAllHomeShortcutsUseCase: createGetAllHomeShortcutsUseCase(
        homeShortcutRepository,
      ),
    }),
    saveEditShortcutsUseCase: createSaveEditShortcutsUseCase({
      saveHomeShortcutsUseCase: createSaveHomeShortcutsUseCase(homeShortcutRepository),
    }),
  };
};
