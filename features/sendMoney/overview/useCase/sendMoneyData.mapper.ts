import type { TransferBeneficiary } from "@/features/transfers/beneficiary/types/types";
import type { TransferRecord } from "@/features/transfers/record/types/types";
import type { FinanceAccount } from "@/features/finance/account/types/types";
import type {
  SendMoneyAccountItem,
  SendMoneyBeneficiaryItem,
  SendMoneyTransferItem,
} from "../types/types";

const findAccountName = (
  accountsById: Map<string, FinanceAccount>,
  accountId: string | null,
): string | null => {
  if (!accountId) {
    return null;
  }

  return accountsById.get(accountId)?.accountName ?? null;
};

export const mapSendMoneyAccountItem = (
  account: FinanceAccount,
): SendMoneyAccountItem => {
  return {
    id: account.id,
    accountName: account.accountName,
    accountType: account.accountType,
    currencyCode: account.currencyCode,
    currentBalance: account.currentBalance,
  };
};

export const mapSendMoneyBeneficiaryItem = (
  beneficiary: TransferBeneficiary,
): SendMoneyBeneficiaryItem => {
  return {
    id: beneficiary.id,
    beneficiaryName: beneficiary.beneficiaryName,
    bankName: beneficiary.bankName,
    accountNumber: beneficiary.accountNumber,
    mobileNumber: beneficiary.mobileNumber,
    transferMethod: beneficiary.transferMethod,
  };
};

export const mapSendMoneyTransferItem = (
  transferRecord: TransferRecord,
  accountsById: Map<string, FinanceAccount>,
): SendMoneyTransferItem => {
  return {
    id: transferRecord.id,
    beneficiaryId: transferRecord.beneficiaryId,
    fromAccountId: transferRecord.fromAccountId,
    toAccountId: transferRecord.toAccountId,
    targetName: transferRecord.targetName,
    targetType: transferRecord.targetType,
    transferMethod: transferRecord.transferMethod,
    sourceAccountName: findAccountName(accountsById, transferRecord.fromAccountId),
    destinationAccountName: findAccountName(accountsById, transferRecord.toAccountId),
    amount: transferRecord.amount,
    note: transferRecord.note,
    recordType: transferRecord.recordType,
    status: transferRecord.status,
    createdAt: transferRecord.createdAt,
    scheduledFor: transferRecord.scheduledFor,
  };
};
