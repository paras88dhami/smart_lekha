import type { Result } from "@/shared/types/result.types";
import type { QuickPosProductSlotRepository } from "../data/repository/quickPosProductSlot.repository";
import type {
  EnsureDefaultQuickPosProductSlotsInput,
  EnsureDefaultQuickPosProductSlotsUseCase,
} from "./ensureDefaultQuickPosProductSlots.useCase";
import {
  DEFAULT_QUICK_POS_SLOT_COUNT,
  DEFAULT_QUICK_POS_SLOT_GROUP,
} from "./quickPosProductSlot.constants";

const createFailure = (error: Error): Result<void> => ({
  success: false,
  error,
});

export const createEnsureDefaultQuickPosProductSlotsUseCase = (
  repository: QuickPosProductSlotRepository,
): EnsureDefaultQuickPosProductSlotsUseCase => ({
  async execute(input: EnsureDefaultQuickPosProductSlotsInput): Promise<Result<void>> {
    const productSlotsResult = await repository.getSlotsByProfileId(input.profileId);

    if (!productSlotsResult.success) {
      return createFailure(productSlotsResult.error);
    }

    const defaultSlots = productSlotsResult.value.filter(
      (slot) => slot.categoryName === DEFAULT_QUICK_POS_SLOT_GROUP,
    );
    const existingOrders = new Set(defaultSlots.map((slot) => slot.slotOrder));
    const defaultItems = input.items.slice(0, DEFAULT_QUICK_POS_SLOT_COUNT);

    for (let slotOrder = 0; slotOrder < DEFAULT_QUICK_POS_SLOT_COUNT; slotOrder += 1) {
      if (existingOrders.has(slotOrder)) {
        continue;
      }

      const createSlotResult = await repository.createSlot({
        profileId: input.profileId,
        categoryName: DEFAULT_QUICK_POS_SLOT_GROUP,
        slotOrder,
        itemId: defaultItems[slotOrder]?.id ?? null,
      });

      if (!createSlotResult.success) {
        return createFailure(createSlotResult.error);
      }
    }

    return {
      success: true,
      value: undefined,
    };
  },
});
