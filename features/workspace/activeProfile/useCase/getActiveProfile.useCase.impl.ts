import type { Result } from "@/shared/types/result.types";
import type { ActiveProfile } from "../types/types";
import type { ActiveProfileRepository } from "../data/repository/activeProfile.repository";
import type { GetActiveProfileUseCase } from "./getActiveProfile.useCase";

export const createGetActiveProfileUseCase = (
  repository: ActiveProfileRepository,
): GetActiveProfileUseCase => ({
  async execute(): Promise<Result<ActiveProfile | null>> {
    return repository.getActiveProfile();
  },
});
