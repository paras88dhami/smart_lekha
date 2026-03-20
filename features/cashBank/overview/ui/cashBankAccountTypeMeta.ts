import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";

export const CASH_BANK_ACCOUNT_TYPES: FinanceAccountType[] = ["cash", "bank", "wallet"];

export const CASH_BANK_ACCOUNT_TYPE_ICONS: Record<FinanceAccountType, string> = {
  cash: "cash-outline",
  bank: "business-outline",
  wallet: "wallet-outline",
};

export const CASH_BANK_ACCOUNT_TYPE_LABEL_KEYS: Record<FinanceAccountType, string> = {
  cash: "cashBank.accountTypes.cash",
  bank: "cashBank.accountTypes.bank",
  wallet: "cashBank.accountTypes.wallet",
};
