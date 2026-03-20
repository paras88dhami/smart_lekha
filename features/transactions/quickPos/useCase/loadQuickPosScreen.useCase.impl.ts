import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { EnsureDefaultPosItemsUseCase } from "@/features/pos/item/useCase/ensureDefaultPosItems.useCase";
import type { GetPosItemsUseCase } from "@/features/pos/item/useCase/getPosItems.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { QuickPosProductSlot } from "../slot/types/types";
import type { EnsureDefaultQuickPosProductSlotsUseCase } from "../slot/useCase/ensureDefaultQuickPosProductSlots.useCase";
import type { GetQuickPosProductSlotsUseCase } from "../slot/useCase/getQuickPosProductSlots.useCase";
import { DEFAULT_QUICK_POS_SLOT_GROUP } from "../slot/useCase/quickPosProductSlot.constants";
import type { LoadQuickPosScreenUseCase, QuickPosScreenData } from "./loadQuickPosScreen.useCase";
import { createQuickPosFailure, type QuickPosResult } from "./quickPosError";

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  ensureDefaultPosItemsUseCase: EnsureDefaultPosItemsUseCase;
  getPosItemsUseCase: GetPosItemsUseCase;
  ensureDefaultQuickPosProductSlotsUseCase: EnsureDefaultQuickPosProductSlotsUseCase;
  getQuickPosProductSlotsUseCase: GetQuickPosProductSlotsUseCase;
};

const sanitizeProductSlots = (
  productSlots: QuickPosProductSlot[],
  itemIds: Set<string>,
): QuickPosProductSlot[] => {
  return productSlots
    .filter((slot) => slot.categoryName === DEFAULT_QUICK_POS_SLOT_GROUP)
    .map((slot) => ({
      ...slot,
      itemId: slot.itemId && itemIds.has(slot.itemId) ? slot.itemId : null,
    }))
    .sort((leftSlot, rightSlot) => leftSlot.slotOrder - rightSlot.slotOrder);
};

export const createLoadQuickPosScreenUseCase = ({
  getActiveProfileUseCase,
  ensureDefaultFinanceAccountsUseCase,
  ensureDefaultPosItemsUseCase,
  getPosItemsUseCase,
  ensureDefaultQuickPosProductSlotsUseCase,
  getQuickPosProductSlotsUseCase,
}: Params): LoadQuickPosScreenUseCase => ({
  async execute(): Promise<QuickPosResult<QuickPosScreenData>> {
    const activeProfileResult = await getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createQuickPosFailure("noActiveProfile");
    }

    const profileId = activeProfileResult.value.profileId;
    const ensureAccountsResult = await ensureDefaultFinanceAccountsUseCase.execute(profileId);

    if (!ensureAccountsResult.success) {
      return createQuickPosFailure("loadFailed", ensureAccountsResult.error);
    }

    const ensureItemsResult = await ensureDefaultPosItemsUseCase.execute({ profileId });

    if (!ensureItemsResult.success) {
      return createQuickPosFailure("loadFailed", ensureItemsResult.error);
    }

    const itemsResult = await getPosItemsUseCase.execute({ profileId });

    if (!itemsResult.success) {
      return createQuickPosFailure("loadFailed", itemsResult.error);
    }

    const ensureSlotsResult = await ensureDefaultQuickPosProductSlotsUseCase.execute({
      profileId,
      items: itemsResult.value,
    });

    if (!ensureSlotsResult.success) {
      return createQuickPosFailure("slotSaveFailed", ensureSlotsResult.error);
    }

    const productSlotsResult = await getQuickPosProductSlotsUseCase.execute({ profileId });

    if (!productSlotsResult.success) {
      return createQuickPosFailure("loadFailed", productSlotsResult.error);
    }

    return {
      success: true,
      value: {
        profileId,
        items: itemsResult.value,
        productSlots: sanitizeProductSlots(
          productSlotsResult.value,
          new Set(itemsResult.value.map((item) => item.id)),
        ),
      },
    };
  },
});
