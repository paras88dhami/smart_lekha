import type { CreatePaymentRecordInput, PaymentRecord } from "../types/types";
import type { CreatePaymentRecordUseCase } from "./createPaymentRecord.useCase";
import type { PaymentRecordRepository } from "../data/repository/paymentRecord.repository";
import type { Result } from "@/shared/types/result.types";

export const createCreatePaymentRecordUseCase = (
  repository: PaymentRecordRepository,
): CreatePaymentRecordUseCase => ({
  async execute(
    input: CreatePaymentRecordInput,
  ): Promise<Result<PaymentRecord>> {
    return repository.createRecord(input);
  },
});
