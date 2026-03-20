import type { CreatePaymentRecordUseCase } from "@/features/transactions/paymentRecord/useCase/createPaymentRecord.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type {
  CreateTransactionsPaymentRecordCommand,
  CreateTransactionsPaymentRecordUseCase,
} from "./createTransactionsPaymentRecord.useCase";
import {
  createTransactionsFailure,
  type TransactionsResult,
} from "./transactionsError";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  createPaymentRecordUseCase: CreatePaymentRecordUseCase;
};

const parsePaymentAmount = (amountInput: string): number => {
  return Number(amountInput);
};

export const createCreateTransactionsPaymentRecordUseCase = (
  dependencies: Dependencies,
): CreateTransactionsPaymentRecordUseCase => ({
  async execute(
    input: CreateTransactionsPaymentRecordCommand,
  ): Promise<TransactionsResult<void>> {
    const partyName = input.partyNameInput.trim();
    const amount = parsePaymentAmount(input.amountInput);

    if (!partyName) {
      return createTransactionsFailure("invalidPartyName");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return createTransactionsFailure("invalidAmount");
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createTransactionsFailure("noActiveProfile");
    }

    const createRecordResult = await dependencies.createPaymentRecordUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      direction: input.direction,
      partyName,
      note: input.noteInput.trim() || null,
      totalAmount: amount,
      settledAmount: 0,
      status: "open",
      settledAt: null,
    });

    if (!createRecordResult.success) {
      return createTransactionsFailure("saveFailed", createRecordResult.error);
    }

    return {
      success: true,
      value: undefined,
    };
  },
});
