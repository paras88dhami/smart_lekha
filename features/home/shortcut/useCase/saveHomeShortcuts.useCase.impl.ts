import type { Result } from "@/shared/types/result.types";
import type { HomeShortcut } from "../types/types";
import type { HomeShortcutRepository } from "../data/repository/homeShortcut.repository";
import type { SaveHomeShortcutsUseCase } from "./saveHomeShortcuts.useCase";

export const createSaveHomeShortcutsUseCase = (
  repository: HomeShortcutRepository,
): SaveHomeShortcutsUseCase => ({
  async execute(profileId: string, shortcuts: HomeShortcut[]): Promise<Result<void>> {
    return repository.saveShortcuts(profileId, shortcuts);
  },
});
