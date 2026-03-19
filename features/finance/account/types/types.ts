import type { FinanceAccountType } from "../data/dataSource/financeAccount.model";

export type FinanceAccount = {
  id: string;
  profileId: string;
  accountName: string;
  accountNumber: string | null;
  accountType: FinanceAccountType;
  isPrimary: boolean;
  currencyCode: string;
  currentBalance: number;
};

export type CreateFinanceAccountInput = {
  profileId: string;
  accountName: string;
  accountNumber: string | null;
  accountType: FinanceAccountType;
  isPrimary: boolean;
  currencyCode: string;
  currentBalance: number;
};

export type AdjustFinanceAccountBalanceInput = {
  accountId: string;
  deltaAmount: number;
};
