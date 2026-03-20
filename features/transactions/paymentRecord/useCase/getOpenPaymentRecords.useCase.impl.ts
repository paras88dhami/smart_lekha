import type { PaymentRecord } from "../types/types";
import type { GetOpenPaymentRecordsUseCase } from "./getOpenPaymentRecords.useCase";
import type { PaymentRecordRepository } from "../data/repository/paymentRecord.repository";
import type { Result } from "@/shared/types/result.types";

export const createGetOpenPaymentRecordsUseCase = (
  repository: PaymentRecordRepository,
): GetOpenPaymentRecordsUseCase => ({
  async execute(profileId: string): Promise<Result<PaymentRecord[]>> {
    return repository.getOpenByProfileId(profileId);
  },
});
