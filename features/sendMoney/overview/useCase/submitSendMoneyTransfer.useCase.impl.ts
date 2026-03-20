import type { Result } from "@/shared/types/result.types";
import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { CreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase";
import type { CreateTransferRecordUseCase } from "@/features/transfers/record/useCase/createTransferRecord.useCase";
import { TRANSFER_METHOD_BANK_NAMES } from "@/features/transfers/shared/config/transferMethodCatalog";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createSendMoneyError } from "./sendMoneyError";
import type {
  SubmitSendMoneyTransferCommand,
  SubmitSendMoneyTransferUseCase,
} from "./submitSendMoneyTransfer.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  createTransferBeneficiaryUseCase: CreateTransferBeneficiaryUseCase;
  createTransferRecordUseCase: CreateTransferRecordUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
};

const parseAmount = (amountInput: string): number => {
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
    const accountNumber = input.accountNumberInput.trim();
    const mobileNumber = input.mobileNumberInput.trim();
    const parsedAmount = parseAmount(input.amountInput);

    if (!beneficiaryName || (!accountNumber && !mobileNumber)) {
      return createFailure(createSendMoneyError("invalid_beneficiary"));
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return createFailure(createSendMoneyError("invalid_amount"));
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createSendMoneyError("no_active_profile"));
    }

    const primaryAccountResult = await dependencies.getPrimaryFinanceAccountUseCase.execute(
      activeProfileResult.value.profileId,
    );
    if (!primaryAccountResult.success || !primaryAccountResult.value) {
      return createFailure(createSendMoneyError("no_primary_account"));
    }

    const beneficiaryResult = await dependencies.createTransferBeneficiaryUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      beneficiaryName,
      bankName: TRANSFER_METHOD_BANK_NAMES[input.selectedMethod],
      accountNumber: accountNumber || null,
      mobileNumber: mobileNumber || null,
      transferMethod: input.selectedMethod,
      isFavorite: true,
    });
    if (!beneficiaryResult.success) {
      return createFailure(createSendMoneyError("save_failed"));
    }

    const transferRecordResult = await dependencies.createTransferRecordUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      beneficiaryId: beneficiaryResult.value.id,
      fromAccountId: primaryAccountResult.value.id,
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
      accountId: primaryAccountResult.value.id,
      entryType: "transfer_out",
      categoryName: "Send Money",
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
      accountId: primaryAccountResult.value.id,
      deltaAmount: -parsedAmount,
    });
    if (!adjustBalanceResult.success) {
      return createFailure(createSendMoneyError("save_failed"));
    }

    return { success: true, value: undefined };
  },
});
