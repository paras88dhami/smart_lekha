import { Status } from "@/shared/types/status.types";
import type {
  QuickPosPickerState,
  QuickPosProductDraft,
  QuickPosState,
} from "./quickPos.viewModel";

export const createEmptyQuickPosProductDraft = (): QuickPosProductDraft => ({
  itemName: "",
  sku: "",
  unitPrice: "",
  availableStock: "",
});

export const createClosedQuickPosPickerState = (): QuickPosPickerState => ({
  isVisible: false,
  selectedSlotId: "",
  searchValue: "",
  draft: createEmptyQuickPosProductDraft(),
  isSaving: false,
});

export const createInitialQuickPosState = (): QuickPosState => ({
  status: Status.Idle,
  items: [],
  productSlots: [],
  cart: [],
  paymentMode: "cash",
  totalAmount: 0,
  searchValue: "",
  errorMessage: "",
  isCheckingOut: false,
  picker: createClosedQuickPosPickerState(),
});
