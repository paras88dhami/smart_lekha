import type {
  PaymentRecordDirection,
  PaymentRecordStatus,
} from "../data/dataSource/paymentRecord.model";

export type PaymentRecord = {
  id: string;
  profileId: string;
  direction: PaymentRecordDirection;
  partyName: string;
  note: string | null;
  totalAmount: number;
  settledAmount: number;
  outstandingAmount: number;
  status: PaymentRecordStatus;
  settledAt: number | null;
  createdAt: number;
};

export type CreatePaymentRecordInput = {
  profileId: string;
  direction: PaymentRecordDirection;
  partyName: string;
  note: string | null;
  totalAmount: number;
  settledAmount: number;
  status: PaymentRecordStatus;
  settledAt: number | null;
};

export type SettlePaymentRecordInput = {
  recordId: string;
  settledAmount: number;
  status: PaymentRecordStatus;
  settledAt: number | null;
};
