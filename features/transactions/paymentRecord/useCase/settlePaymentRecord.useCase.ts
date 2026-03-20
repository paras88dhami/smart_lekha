import type { Result } from "@/shared/types/result.types";
import type { PaymentRecord, SettlePaymentRecordInput } from "../types/types";

export interface SettlePaymentRecordUseCase {
  execute(input: SettlePaymentRecordInput): Promise<Result<PaymentRecord>>;
}
