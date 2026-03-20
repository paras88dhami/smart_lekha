import type { Result } from "@/shared/types/result.types";
import type { PaymentRecord } from "../types/types";

export interface GetOpenPaymentRecordsUseCase {
  execute(profileId: string): Promise<Result<PaymentRecord[]>>;
}
