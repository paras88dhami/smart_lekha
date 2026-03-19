import type { PosCartLine } from "@/features/pos/item/types/types";
import type { PosPaymentMode, PosSaleStatus } from "../data/dataSource/posSale.model";

export type PosSale = {
  id: string;
  profileId: string;
  accountId: string | null;
  saleNumber: string;
  lineItems: PosCartLine[];
  totalAmount: number;
  paymentMode: PosPaymentMode;
  status: PosSaleStatus;
  createdAt: number;
};

export type CreatePosSaleInput = {
  profileId: string;
  accountId: string | null;
  saleNumber: string;
  lineItems: PosCartLine[];
  totalAmount: number;
  paymentMode: PosPaymentMode;
  status: PosSaleStatus;
};
