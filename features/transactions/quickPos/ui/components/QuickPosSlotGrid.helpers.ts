import type { PosItem } from "@/features/pos/item/types/types";
import type { QuickPosProductSlot } from "@/features/transactions/quickPos/slot/types/types";

export const COLUMN_COUNT = 4;
export const SLOT_GAP = 10;
export const DOUBLE_TAP_DELAY = 280;
export const SINGLE_TAP_DELAY = 240;
export const FALLBACK_VIEWPORT_WIDTH = 320;

export const getStockLabel = (
  item: PosItem,
  translateText: (key: string) => string,
): string => {
  if (item.availableStock <= 0) {
    return translateText("quickPos.stockOut");
  }

  if (item.availableStock <= 5) {
    return translateText("quickPos.stockLow");
  }

  return translateText("quickPos.stockAvailable");
};

export const filterQuickPosProductSlots = (
  productSlots: QuickPosProductSlot[],
  itemById: Map<string, PosItem>,
  searchValue: string,
): QuickPosProductSlot[] => {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (!normalizedSearchValue) {
    return productSlots;
  }

  return productSlots.filter((slot) => {
    if (!slot.itemId) {
      return true;
    }

    const productItem = itemById.get(slot.itemId);

    if (!productItem) {
      return false;
    }

    return (
      productItem.itemName.toLowerCase().includes(normalizedSearchValue) ||
      productItem.sku?.toLowerCase().includes(normalizedSearchValue)
    );
  });
};
