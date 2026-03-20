import type { CreateQuickPosProductForSlotInput } from "../useCase/createQuickPosProductForSlot.useCase";
import type { QuickPosProductDraft } from "./quickPos.viewModel";

export const buildQuickPosProductRequest = (
  profileId: string,
  slotId: string,
  draft: QuickPosProductDraft,
): CreateQuickPosProductForSlotInput => {
  return {
    profileId,
    slotId,
    itemName: draft.itemName,
    sku: draft.sku.trim() ? draft.sku : null,
    unitPrice: Number(draft.unitPrice || 0),
    availableStock: Number(draft.availableStock || 0),
  };
};
