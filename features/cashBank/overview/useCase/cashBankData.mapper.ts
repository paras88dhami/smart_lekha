import type { FinanceAccount } from "@/features/finance/account/types/types";
import type { CashBankAccountItem } from "../types/types";

export const mapCashBankAccountItem = (
  account: FinanceAccount,
): CashBankAccountItem => {
  return {
    id: account.id,
    accountName: account.accountName,
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    currencyCode: account.currencyCode,
    currentBalance: account.currentBalance,
    isPrimary: account.isPrimary,
  };
};
