import type { Result } from "@/shared/types/result.types";
import { DEFAULT_HOME_SHORTCUT_SEEDS } from "../config/homeShortcutCatalog";
import type { HomeShortcutSeed } from "../types/types";
import type { HomeShortcutRepository } from "../data/repository/homeShortcut.repository";
import type { EnsureDefaultHomeShortcutsUseCase } from "./ensureDefaultHomeShortcuts.useCase";

export const createEnsureDefaultHomeShortcutsUseCase = (
  repository: HomeShortcutRepository,
): EnsureDefaultHomeShortcutsUseCase => ({
  async execute(profileId: string): Promise<Result<void>> {
    const defaultShortcuts: HomeShortcutSeed[] = DEFAULT_HOME_SHORTCUT_SEEDS;
    return repository.createDefaultShortcuts(profileId, defaultShortcuts);
  },
});
