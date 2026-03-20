import type { Result } from "@/shared/types/result.types";
import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { CreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase";
import type { CreateTransferRecordUseCase } from "@/features/transfers/record/useCase/createTransferRecord.useCase";
import {
  hasRequiredTransferMethodInputs,
  sanitizeTransferMethodInputs,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import type { GetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createSendMoneyError } from "./sendMoneyError";
import type {
  SubmitSendMoneyTransferCommand,
  SubmitSendMoneyTransferUseCase,
} from "./submitSendMoneyTransfer.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getActiveAccountUseCase: GetActiveAccountUseCase;
  createTransferBeneficiaryUseCase: CreateTransferBeneficiaryUseCase;
  createTransferRecordUseCase: CreateTransferRecordUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
};

const parseTransferAmount = (amountInput: string): number => {
  return Number(amountInput);
};

const createFailure = (error: Error): Result<void> => {
  return { success: false, error };
};

export const createSubmitSendMoneyTransferUseCase = (
  dependencies: Dependencies,
): SubmitSendMoneyTransferUseCase => ({
  async execute(input: SubmitSendMoneyTransferCommand): Promise<Result<void>> {
    const beneficiaryName = input.beneficiaryNameInput.trim();
    const transferContactFields = sanitizeTransferMethodInputs(input.selectedMethod, {
      bankNameInput: "",
      accountNumberInput: input.accountNumberInput,
      mobileNumberInput: input.mobileNumberInput,
    });
    const parsedAmount = parseTransferAmount(input.amountInput);

    if (
      !beneficiaryName ||
      !hasRequiredTransferMethodInputs(input.selectedMethod, transferContactFields)
    ) {
      return createFailure(createSendMoneyError("invalid_beneficiary"));
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return createFailure(createSendMoneyError("invalid_amount"));
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createSendMoneyError("no_active_profile"));
    }

    const activeAccountResult = await dependencies.getActiveAccountUseCase.execute();
    if (!activeAccountResult.success || !activeAccountResult.value) {
      return createFailure(createSendMoneyError("no_primary_account"));
    }

    const beneficiaryResult = await dependencies.createTransferBeneficiaryUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      beneficiaryName,
      bankName: transferContactFields.bankName,
      accountNumber: transferContactFields.accountNumber,
      mobileNumber: transferContactFields.mobileNumber,
      transferMethod: input.selectedMethod,
      isFavorite: true,
    });
    if (!beneficiaryResult.success) {
      return createFailure(createSendMoneyError("save_failed"));
    }

    const transferRecordResult = await dependencies.createTransferRecordUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      beneficiaryId: beneficiaryResult.value.id,
      fromAccountId: activeAccountResult.value.id,
      amount: parsedAmount,
      note: input.noteInput.trim() || null,
      recordType: input.isScheduled ? "scheduled" : "saved",
      scheduledFor: input.isScheduled ? Date.now() + 24 * 60 * 60 * 1000 : null,
      status: input.isScheduled ? "pending" : "completed",
    });
    if (!transferRecordResult.success) {
      return createFailure(createSendMoneyError("save_failed"));
    }

    if (input.isScheduled) {
      return { success: true, value: undefined };
    }

    const transactionResult = await dependencies.createFinanceTransactionUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      accountId: activeAccountResult.value.id,
      entryType: "transfer_out",
      categoryName: "Transfers",
      counterpartyName: beneficiaryName,
      note: input.noteInput.trim() || null,
      status: "success",
      amount: parsedAmount,
      occurredAt: Date.now(),
      referenceId: transferRecordResult.value.id,
    });
    if (!transactionResult.success) {
      return createFailure(createSendMoneyError("save_failed"));
    }

    const adjustBalanceResult = await dependencies.adjustFinanceAccountBalanceUseCase.execute({
      accountId: activeAccountResult.value.id,
      deltaAmount: -parsedAmount,
    });
    if (!adjustBalanceResult.success) {
      return createFailure(createSendMoneyError("save_failed"));
    }

    return { success: true, value: undefined };
  },
});
