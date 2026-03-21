import type { FinanceAccount } from "@/features/finance/account/types/types";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { ResolveSendMoneyBeneficiaryUseCase } from "./resolveSendMoneyBeneficiary.useCase";
import type { SubmitSendMoneyTransferCommand } from "./submitSendMoneyTransfer.useCase";
import {
  hasRequiredTransferMethodInputs,
  sanitizeTransferMethodInputs,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import type { Result } from "@/shared/types/result.types";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import { createSendMoneyError, type SendMoneyError } from "./sendMoneyError";

export type ResolvedSendMoneyTarget = {
  beneficiaryId: string | null;
  toAccountId: string | null;
  targetName: string;
  transferMethod: TransferMethod;
};

export const parseTransferAmount = (amountInput: string): number => {
  return Number(amountInput);
};

export const createSendMoneyFailure = (code: SendMoneyError["code"]): Result<void> => {
  return { success: false, error: createSendMoneyError(code) };
};

export const loadSendMoneyAccount = async (
  profileId: string,
  accountId: string,
  errorCode: SendMoneyError["code"],
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase,
): Promise<Result<FinanceAccount>> => {
  if (!accountId.trim()) {
    return { success: false, error: createSendMoneyError(errorCode) };
  }

  const result = await getFinanceAccountByIdUseCase.execute(accountId);

  if (!result.success || result.value.profileId !== profileId || result.value.isArchived) {
    return { success: false, error: createSendMoneyError(errorCode) };
  }

  return { success: true, value: result.value };
};

export const resolveBeneficiaryTransferTarget = async (
  profileId: string,
  input: SubmitSendMoneyTransferCommand,
  resolveSendMoneyBeneficiaryUseCase: ResolveSendMoneyBeneficiaryUseCase,
): Promise<Result<ResolvedSendMoneyTarget>> => {
  const beneficiaryName = input.beneficiaryNameInput.trim();
  const transferContactFields = sanitizeTransferMethodInputs(input.selectedMethod, {
    bankNameInput: "",
    accountNumberInput: input.accountNumberInput,
    mobileNumberInput: input.mobileNumberInput,
  });

  if (
    !beneficiaryName ||
    !hasRequiredTransferMethodInputs(input.selectedMethod, transferContactFields)
  ) {
    return { success: false, error: createSendMoneyError("invalid_beneficiary") };
  }

  const result = await resolveSendMoneyBeneficiaryUseCase.execute({
    profileId,
    beneficiaryName,
    bankName: transferContactFields.bankName,
    accountNumber: transferContactFields.accountNumber,
    mobileNumber: transferContactFields.mobileNumber,
    transferMethod: input.selectedMethod,
  });

  if (!result.success) {
    return { success: false, error: createSendMoneyError("save_failed") };
  }

  return {
    success: true,
    value: {
      beneficiaryId: result.value.id,
      toAccountId: null,
      targetName: result.value.beneficiaryName,
      transferMethod: input.selectedMethod,
    },
  };
};

export const resolveOwnAccountTransferTarget = async (
  profileId: string,
  sourceAccountId: string,
  destinationAccountId: string,
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase,
): Promise<Result<ResolvedSendMoneyTarget>> => {
  const destinationAccountResult = await loadSendMoneyAccount(
    profileId,
    destinationAccountId,
    "invalid_destination_account",
    getFinanceAccountByIdUseCase,
  );

  if (!destinationAccountResult.success) {
    return destinationAccountResult;
  }

  if (destinationAccountResult.value.id === sourceAccountId) {
    return { success: false, error: createSendMoneyError("same_account_transfer") };
  }

  return {
    success: true,
    value: {
      beneficiaryId: null,
      toAccountId: destinationAccountResult.value.id,
      targetName: destinationAccountResult.value.accountName,
      transferMethod: destinationAccountResult.value.accountType,
    },
  };
};
