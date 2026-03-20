import type { Result } from "@/shared/types/result.types";
import type {
  PaymentRecordDirection,
  PaymentRecordModel,
  PaymentRecordStatus,
} from "./paymentRecord.model";

export type CreatePaymentRecordPayload = {
  profileId: string;
  direction: PaymentRecordDirection;
  partyName: string;
  note: string | null;
  totalAmount: number;
  settledAmount: number;
  status: PaymentRecordStatus;
  settledAt: number | null;
};

export type SettlePaymentRecordPayload = {
  recordId: string;
  settledAmount: number;
  status: PaymentRecordStatus;
  settledAt: number | null;
};

export interface PaymentRecordDataSource {
  getOpenByProfileId(profileId: string): Promise<Result<PaymentRecordModel[]>>;
  getById(recordId: string): Promise<Result<PaymentRecordModel>>;
  createRecord(payload: CreatePaymentRecordPayload): Promise<Result<PaymentRecordModel>>;
  settleRecord(payload: SettlePaymentRecordPayload): Promise<Result<PaymentRecordModel>>;
}
