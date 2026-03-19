import type { PosItem } from "@/features/pos/item/types/types";
import type { StatusType } from "@/shared/types/status.types";

export type QuickPosCartItem = {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type QuickPosState = {
  status: StatusType;
  items: PosItem[];
  cart: QuickPosCartItem[];
  paymentMode: "cash" | "bank";
  totalAmount: number;
  errorMessage: string;
};

export interface QuickPosViewModel {
  state: QuickPosState;
  onRefreshPress(): Promise<void>;
  onIncreaseItemPress(itemId: string): void;
  onDecreaseItemPress(itemId: string): void;
  onPaymentModePress(mode: "cash" | "bank"): void;
  onCheckoutPress(): Promise<void>;
}
