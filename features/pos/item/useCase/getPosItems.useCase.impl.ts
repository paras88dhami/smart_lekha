import type { Result } from "@/shared/types/result.types";
import type { PosItem } from "../types/types";
import type { PosItemRepository } from "../data/repository/posItem.repository";
import type {
  GetPosItemsInput,
  GetPosItemsUseCase,
} from "./getPosItems.useCase";

export const createGetPosItemsUseCase = (
  repository: PosItemRepository,
): GetPosItemsUseCase => ({
  async execute(input: GetPosItemsInput): Promise<Result<PosItem[]>> {
    return repository.getActiveItemsByProfileId(input.profileId);
  },
});
