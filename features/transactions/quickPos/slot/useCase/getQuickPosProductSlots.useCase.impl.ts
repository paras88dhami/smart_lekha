import type { Result } from "@/shared/types/result.types";
import type { QuickPosProductSlot } from "../types/types";
import type { QuickPosProductSlotRepository } from "../data/repository/quickPosProductSlot.repository";
import type {
  GetQuickPosProductSlotsInput,
  GetQuickPosProductSlotsUseCase,
} from "./getQuickPosProductSlots.useCase";

export const createGetQuickPosProductSlotsUseCase = (
  repository: QuickPosProductSlotRepository,
): GetQuickPosProductSlotsUseCase => ({
  async execute(
    input: GetQuickPosProductSlotsInput,
  ): Promise<Result<QuickPosProductSlot[]>> {
    return repository.getSlotsByProfileId(input.profileId);
  },
});
