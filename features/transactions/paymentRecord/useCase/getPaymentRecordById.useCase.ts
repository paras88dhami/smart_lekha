import type { Result } from "@/shared/types/result.types";
import type { PaymentRecord } from "../types/types";

export interface GetPaymentRecordByIdUseCase {
  execute(recordId: string): Promise<Result<PaymentRecord>>;
}
