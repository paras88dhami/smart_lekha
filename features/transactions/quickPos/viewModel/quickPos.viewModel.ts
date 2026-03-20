import type { PosCartLine, PosItem } from "@/features/pos/item/types/types";
import type { QuickPosProductSlot } from "@/features/transactions/quickPos/slot/types/types";
import type { StatusType } from "@/shared/types/status.types";

export type QuickPosCartItem = PosCartLine;

export type QuickPosPaymentMode = "cash" | "bank";

export type QuickPosProductDraft = {
  itemName: string;
  sku: string;
  unitPrice: string;
  availableStock: string;
};

export type QuickPosProductDraftField = keyof QuickPosProductDraft;

export type QuickPosPickerState = {
  isVisible: boolean;
  selectedSlotId: string;
  searchValue: string;
  draft: QuickPosProductDraft;
  isSaving: boolean;
};

export type QuickPosCreateProductInput = {
  itemName: string;
  sku: string | null;
  unitPrice: number;
  availableStock: number;
};

export type QuickPosState = {
  status: StatusType;
  items: PosItem[];
  productSlots: QuickPosProductSlot[];
  cart: QuickPosCartItem[];
  paymentMode: QuickPosPaymentMode;
  totalAmount: number;
  searchValue: string;
  errorMessage: string;
  isCheckingOut: boolean;
  picker: QuickPosPickerState;
};

export interface QuickPosViewModel {
  state: QuickPosState;
  onRefreshPress(): Promise<void>;
  onSearchValueChange(searchValue: string): void;
  onIncreaseItemPress(itemId: string): void;
  onDecreaseItemPress(itemId: string): void;
  onPaymentModePress(mode: QuickPosPaymentMode): void;
  onClearCartPress(): void;
  onOpenProductPicker(slotId: string): void;
  onCloseProductPicker(): void;
  onPickerSearchValueChange(searchValue: string): void;
  onProductDraftChange(field: QuickPosProductDraftField, value: string): void;
  onSelectProduct(itemId: string): Promise<void>;
  onCreateProductPress(): Promise<void>;
  onClearProductSlot(slotId: string): Promise<void>;
  onCheckoutPress(): Promise<void>;
}
