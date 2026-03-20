import type { PosItem } from "@/features/pos/item/types/types";
import type { QuickPosCartItem } from "./quickPos.viewModel";

export type QuickPosCartSnapshot = {
  cart: QuickPosCartItem[];
  totalAmount: number;
};

export const buildQuickPosCartSnapshot = (
  items: PosItem[],
  quantityByItemId: Record<string, number>,
): QuickPosCartSnapshot => {
  const cart = items
    .map((item) => {
      const quantity = Math.min(quantityByItemId[item.id] ?? 0, item.availableStock);

      if (quantity <= 0) {
        return null;
      }

      return {
        itemId: item.id,
        itemName: item.itemName,
        quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.unitPrice * quantity,
      };
    })
    .filter((item): item is QuickPosCartItem => item !== null);

  return {
    cart,
    totalAmount: cart.reduce((sum, item) => sum + item.lineTotal, 0),
  };
};
