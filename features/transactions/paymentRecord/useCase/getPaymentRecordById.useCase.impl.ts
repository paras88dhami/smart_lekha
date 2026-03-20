import type { PaymentRecord } from "../types/types";
import type { GetPaymentRecordByIdUseCase } from "./getPaymentRecordById.useCase";
import type { PaymentRecordRepository } from "../data/repository/paymentRecord.repository";
import type { Result } from "@/shared/types/result.types";

export const createGetPaymentRecordByIdUseCase = (
  repository: PaymentRecordRepository,
): GetPaymentRecordByIdUseCase => ({
  async execute(recordId: string): Promise<Result<PaymentRecord>> {
    return repository.getById(recordId);
  },
});
