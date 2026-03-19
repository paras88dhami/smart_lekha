import type { Result } from "@/shared/types/result.types";
import type { HomeShortcut } from "../types/types";
import type { HomeShortcutRepository } from "../data/repository/homeShortcut.repository";
import type { GetHomeShortcutsUseCase } from "./getHomeShortcuts.useCase";

export const createGetHomeShortcutsUseCase = (
  repository: HomeShortcutRepository,
): GetHomeShortcutsUseCase => ({
  async execute(profileId: string): Promise<Result<HomeShortcut[]>> {
    return repository.getShortcutsByProfileId(profileId);
  },
});
