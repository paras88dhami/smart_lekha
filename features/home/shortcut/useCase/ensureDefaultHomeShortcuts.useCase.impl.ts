import type { Result } from "@/shared/types/result.types";
import type { HomeShortcutSeed } from "../types/types";
import type { HomeShortcutRepository } from "../data/repository/homeShortcut.repository";
import type { EnsureDefaultHomeShortcutsUseCase } from "./ensureDefaultHomeShortcuts.useCase";

const DEFAULT_HOME_SHORTCUTS: HomeShortcutSeed[] = [
  { shortcutKey: "my_profile", sortOrder: 1 },
  { shortcutKey: "my_accounts", sortOrder: 2 },
  { shortcutKey: "statement", sortOrder: 3 },
  { shortcutKey: "esewa", sortOrder: 4 },
  { shortcutKey: "quick_pos", sortOrder: 5 },
  { shortcutKey: "send_money", sortOrder: 6 },
];

export const createEnsureDefaultHomeShortcutsUseCase = (
  repository: HomeShortcutRepository,
): EnsureDefaultHomeShortcutsUseCase => ({
  async execute(profileId: string): Promise<Result<void>> {
    return repository.createDefaultShortcuts(profileId, DEFAULT_HOME_SHORTCUTS);
  },
});
