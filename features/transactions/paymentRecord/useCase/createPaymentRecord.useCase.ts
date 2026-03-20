import type { Result } from "@/shared/types/result.types";
import type { CreatePaymentRecordInput, PaymentRecord } from "../types/types";

export interface CreatePaymentRecordUseCase {
  execute(input: CreatePaymentRecordInput): Promise<Result<PaymentRecord>>;
}
