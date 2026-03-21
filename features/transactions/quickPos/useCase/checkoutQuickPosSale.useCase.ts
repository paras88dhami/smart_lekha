import type { PosItem, PosCartLine } from "@/features/pos/item/types/types";
import type { PosPaymentMode } from "@/features/pos/sale/data/dataSource/posSale.model";
import type { QuickPosResult } from "./quickPosError";

export type CheckoutQuickPosSaleInput = {
  profileId: string;
  receivingAccountId: string;
  items: PosItem[];
  cart: PosCartLine[];
  totalAmount: number;
  paymentMode: PosPaymentMode;
};

export interface CheckoutQuickPosSaleUseCase {
  execute(input: CheckoutQuickPosSaleInput): Promise<QuickPosResult<void>>;
}
