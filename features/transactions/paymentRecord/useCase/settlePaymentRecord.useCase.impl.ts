import type { PaymentRecord, SettlePaymentRecordInput } from "../types/types";
import type { SettlePaymentRecordUseCase } from "./settlePaymentRecord.useCase";
import type { PaymentRecordRepository } from "../data/repository/paymentRecord.repository";
import type { Result } from "@/shared/types/result.types";

export const createSettlePaymentRecordUseCase = (
  repository: PaymentRecordRepository,
): SettlePaymentRecordUseCase => ({
  async execute(
    input: SettlePaymentRecordInput,
  ): Promise<Result<PaymentRecord>> {
    return repository.settleRecord(input);
  },
});
