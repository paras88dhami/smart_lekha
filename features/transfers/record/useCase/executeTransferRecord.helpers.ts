import type { FinanceAccount } from "@/features/finance/account/types/types";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { Result } from "@/shared/types/result.types";
import type { TransferRecord } from "../types/types";

const createFailure = <T>(message: string): Result<T> => {
  return { success: false, error: new Error(message) };
};

export const loadTransferAccount = async (
  accountId: string | null,
  profileId: string,
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase,
): Promise<Result<FinanceAccount>> => {
  if (!accountId) {
    return createFailure("Transfer account is missing.");
  }

  const result = await getFinanceAccountByIdUseCase.execute(accountId);

  if (!result.success) {
    return createFailure(result.error.message);
  }

  if (result.value.profileId !== profileId || result.value.isArchived) {
    return createFailure("Transfer account is not available.");
  }

  return { success: true, value: result.value };
};

export const createTransferTransaction = async (
  transferRecord: TransferRecord,
  accountId: string,
  counterpartyName: string,
  entryType: FinanceEntryType,
  amount: number,
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase,
): Promise<Result<void>> => {
  const result = await createFinanceTransactionUseCase.execute({
    profileId: transferRecord.profileId,
    accountId,
    entryType,
    categoryName: "Transfers",
    counterpartyName,
    note: transferRecord.note,
    status: "success",
    amount,
    occurredAt: transferRecord.scheduledFor ?? Date.now(),
    referenceId: transferRecord.id,
  });

  if (!result.success) {
    return createFailure(result.error.message);
  }

  return { success: true, value: undefined };
};

export const adjustTransferAccountBalance = async (
  accountId: string,
  deltaAmount: number,
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase,
): Promise<Result<void>> => {
  const result = await adjustFinanceAccountBalanceUseCase.execute({
    accountId,
    deltaAmount,
  });

  if (!result.success) {
    return createFailure(result.error.message);
  }

  return { success: true, value: undefined };
};

export const executeBeneficiaryTransferRecord = async (
  transferRecord: TransferRecord,
  sourceAccount: FinanceAccount,
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase,
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase,
): Promise<Result<void>> => {
  const transactionResult = await createTransferTransaction(
    transferRecord,
    sourceAccount.id,
    transferRecord.targetName,
    "transfer_out",
    transferRecord.amount,
    createFinanceTransactionUseCase,
  );

  if (!transactionResult.success) {
    return transactionResult;
  }

  return adjustTransferAccountBalance(
    sourceAccount.id,
    -transferRecord.amount,
    adjustFinanceAccountBalanceUseCase,
  );
};

export const executeOwnAccountTransferRecord = async (
  transferRecord: TransferRecord,
  sourceAccount: FinanceAccount,
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase,
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase,
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase,
): Promise<Result<void>> => {
  const destinationAccountResult = await loadTransferAccount(
    transferRecord.toAccountId,
    transferRecord.profileId,
    getFinanceAccountByIdUseCase,
  );

  if (!destinationAccountResult.success) {
    return destinationAccountResult;
  }

  if (destinationAccountResult.value.id === sourceAccount.id) {
    return createFailure("Source and destination accounts must differ.");
  }

  const outgoingResult = await createTransferTransaction(
    transferRecord,
    sourceAccount.id,
    destinationAccountResult.value.accountName,
    "transfer_out",
    transferRecord.amount,
    createFinanceTransactionUseCase,
  );

  if (!outgoingResult.success) {
    return outgoingResult;
  }

  const incomingResult = await createTransferTransaction(
    transferRecord,
    destinationAccountResult.value.id,
    sourceAccount.accountName,
    "transfer_in",
    transferRecord.amount,
    createFinanceTransactionUseCase,
  );

  if (!incomingResult.success) {
    return incomingResult;
  }

  const debitResult = await adjustTransferAccountBalance(
    sourceAccount.id,
    -transferRecord.amount,
    adjustFinanceAccountBalanceUseCase,
  );

  if (!debitResult.success) {
    return debitResult;
  }

  return adjustTransferAccountBalance(
    destinationAccountResult.value.id,
    transferRecord.amount,
    adjustFinanceAccountBalanceUseCase,
  );
};
