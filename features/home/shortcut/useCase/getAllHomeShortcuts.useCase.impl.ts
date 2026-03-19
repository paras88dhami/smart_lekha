import type { Result } from "@/shared/types/result.types";
import type { HomeShortcut } from "../types/types";
import type { HomeShortcutRepository } from "../data/repository/homeShortcut.repository";
import type { GetAllHomeShortcutsUseCase } from "./getAllHomeShortcuts.useCase";

export const createGetAllHomeShortcutsUseCase = (
  repository: HomeShortcutRepository,
): GetAllHomeShortcutsUseCase => ({
  async execute(profileId: string): Promise<Result<HomeShortcut[]>> {
    return repository.getAllShortcutsByProfileId(profileId);
  },
});
