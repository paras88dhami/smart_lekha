import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { GetPaymentRecordByIdUseCase } from "@/features/transactions/paymentRecord/useCase/getPaymentRecordById.useCase";
import type { SettlePaymentRecordUseCase } from "@/features/transactions/paymentRecord/useCase/settlePaymentRecord.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type {
  SettleTransactionsPaymentRecordCommand,
  SettleTransactionsPaymentRecordUseCase,
} from "./settleTransactionsPaymentRecord.useCase";
import {
  createTransactionsFailure,
  type TransactionsResult,
} from "./transactionsError";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getPaymentRecordByIdUseCase: GetPaymentRecordByIdUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
  settlePaymentRecordUseCase: SettlePaymentRecordUseCase;
};

const createEntryType = (
  direction: "to_receive" | "to_pay",
): "payment_in" | "payment_out" => {
  return direction === "to_receive" ? "payment_in" : "payment_out";
};

const createCategoryName = (direction: "to_receive" | "to_pay"): string => {
  return direction === "to_receive" ? "To Receive" : "To Pay";
};

const createBalanceDelta = (
  direction: "to_receive" | "to_pay",
  amount: number,
): number => {
  return direction === "to_receive" ? amount : -amount;
};

export const createSettleTransactionsPaymentRecordUseCase = (
  dependencies: Dependencies,
): SettleTransactionsPaymentRecordUseCase => ({
  async execute(
    input: SettleTransactionsPaymentRecordCommand,
  ): Promise<TransactionsResult<void>> {
    const recordResult = await dependencies.getPaymentRecordByIdUseCase.execute(
      input.recordId,
    );

    if (!recordResult.success || recordResult.value.status !== "open") {
      return createTransactionsFailure("recordNotFound");
    }

    const record = recordResult.value;

    if (record.outstandingAmount <= 0) {
      return createTransactionsFailure("settleFailed");
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (
      !activeProfileResult.success ||
      !activeProfileResult.value ||
      activeProfileResult.value.profileId !== record.profileId
    ) {
      return createTransactionsFailure("noActiveProfile");
    }

    const primaryAccountResult =
      await dependencies.getPrimaryFinanceAccountUseCase.execute(record.profileId);

    if (!primaryAccountResult.success || !primaryAccountResult.value) {
      return createTransactionsFailure("noPrimaryAccount");
    }

    const transactionResult = await dependencies.createFinanceTransactionUseCase.execute({
      profileId: record.profileId,
      accountId: primaryAccountResult.value.id,
      entryType: createEntryType(record.direction),
      categoryName: createCategoryName(record.direction),
      counterpartyName: record.partyName,
      note: record.note,
      status: "success",
      amount: record.outstandingAmount,
      occurredAt: Date.now(),
      referenceId: record.id,
    });

    if (!transactionResult.success) {
      return createTransactionsFailure("settleFailed", transactionResult.error);
    }

    const adjustBalanceResult =
      await dependencies.adjustFinanceAccountBalanceUseCase.execute({
        accountId: primaryAccountResult.value.id,
        deltaAmount: createBalanceDelta(record.direction, record.outstandingAmount),
      });

    if (!adjustBalanceResult.success) {
      return createTransactionsFailure("settleFailed", adjustBalanceResult.error);
    }

    const settleRecordResult = await dependencies.settlePaymentRecordUseCase.execute({
      recordId: record.id,
      settledAmount: record.totalAmount,
      status: "settled",
      settledAt: Date.now(),
    });

    if (!settleRecordResult.success) {
      return createTransactionsFailure("settleFailed", settleRecordResult.error);
    }

    return {
      success: true,
      value: undefined,
    };
  },
});
