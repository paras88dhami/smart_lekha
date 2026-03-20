import type { Result } from "@/shared/types/result.types";
import type { PosSale } from "../types/types";
import type { PosSaleRepository } from "../data/repository/posSale.repository";
import type { GetRecentPosSalesUseCase } from "./getRecentPosSales.useCase";

export const createGetRecentPosSalesUseCase = (
  repository: PosSaleRepository,
): GetRecentPosSalesUseCase => ({
  async execute(profileId: string, limit: number): Promise<Result<PosSale[]>> {
    return repository.getRecentByProfileId(profileId, limit);
  },
});
