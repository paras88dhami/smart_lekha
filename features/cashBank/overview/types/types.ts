import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { StatusType } from "@/shared/types/status.types";

export type CashBankAccountItem = {
  id: string;
  accountName: string;
  accountNumber: string | null;
  accountType: FinanceAccountType;
  currencyCode: string;
  currentBalance: number;
  isPrimary: boolean;
};

export type CashBankOverviewData = {
  profileName: string;
  accounts: CashBankAccountItem[];
};

export type CashBankState = {
  status: StatusType;
  profileName: string;
  accounts: CashBankAccountItem[];
  errorMessage: string;
};

export interface CashBankViewModel {
  state: CashBankState;
  onRefreshPress(): Promise<void>;
  onAddAccountPress(): void;
  onEditAccountPress(accountId: string): void;
  onViewStatementPress(accountId: string): void;
  onSetPrimaryPress(accountId: string): Promise<void>;
}
