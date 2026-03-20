import type { AssignQuickPosProductSlotUseCase } from "../slot/useCase/assignQuickPosProductSlot.useCase";
import type { GetQuickPosProductSlotsUseCase } from "../slot/useCase/getQuickPosProductSlots.useCase";
import type { QuickPosProductSlot } from "../slot/types/types";
import type {
  AssignQuickPosProductSelectionInput,
  AssignQuickPosProductSelectionUseCase,
} from "./assignQuickPosProductSelection.useCase";
import { createQuickPosFailure, type QuickPosResult } from "./quickPosError";

type Params = {
  getQuickPosProductSlotsUseCase: GetQuickPosProductSlotsUseCase;
  assignQuickPosProductSlotUseCase: AssignQuickPosProductSlotUseCase;
};

const isProductPinnedToAnotherSlot = (
  productSlots: QuickPosProductSlot[],
  input: AssignQuickPosProductSelectionInput,
): boolean => {
  if (!input.itemId) {
    return false;
  }

  return productSlots.some((slot) => slot.id !== input.slotId && slot.itemId === input.itemId);
};

export const createAssignQuickPosProductSelectionUseCase = ({
  getQuickPosProductSlotsUseCase,
  assignQuickPosProductSlotUseCase,
}: Params): AssignQuickPosProductSelectionUseCase => ({
  async execute(input: AssignQuickPosProductSelectionInput): Promise<QuickPosResult<void>> {
    const productSlotsResult = await getQuickPosProductSlotsUseCase.execute({
      profileId: input.profileId,
    });

    if (!productSlotsResult.success) {
      return createQuickPosFailure("loadFailed", productSlotsResult.error);
    }

    if (isProductPinnedToAnotherSlot(productSlotsResult.value, input)) {
      return createQuickPosFailure("productAlreadyPinned");
    }

    const assignSlotResult = await assignQuickPosProductSlotUseCase.execute({
      slotId: input.slotId,
      itemId: input.itemId,
    });

    if (!assignSlotResult.success) {
      return createQuickPosFailure("slotSaveFailed", assignSlotResult.error);
    }

    return {
      success: true,
      value: undefined,
    };
  },
});
