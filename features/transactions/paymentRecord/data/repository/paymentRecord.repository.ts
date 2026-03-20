import type { Result } from "@/shared/types/result.types";
import type {
  CreatePaymentRecordInput,
  PaymentRecord,
  SettlePaymentRecordInput,
} from "../../types/types";

export interface PaymentRecordRepository {
  getOpenByProfileId(profileId: string): Promise<Result<PaymentRecord[]>>;
  getById(recordId: string): Promise<Result<PaymentRecord>>;
  createRecord(input: CreatePaymentRecordInput): Promise<Result<PaymentRecord>>;
  settleRecord(input: SettlePaymentRecordInput): Promise<Result<PaymentRecord>>;
}
