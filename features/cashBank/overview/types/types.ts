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

export type CashBankFormState = {
  accountNameInput: string;
  accountNumberInput: string;
  openingBalanceInput: string;
  selectedAccountType: FinanceAccountType;
};

export type CashBankState = {
  status: StatusType;
  profileName: string;
  accounts: CashBankAccountItem[];
  showAddAccountForm: boolean;
  form: CashBankFormState;
  errorMessage: string;
};

export interface CashBankViewModel {
  state: CashBankState;
  onRefreshPress(): Promise<void>;
  onToggleAddAccountPress(): void;
  onAccountNameChange(value: string): void;
  onAccountNumberChange(value: string): void;
  onOpeningBalanceChange(value: string): void;
  onAccountTypePress(accountType: FinanceAccountType): void;
  onCreateAccountPress(): Promise<void>;
  onSetPrimaryPress(accountId: string): Promise<void>;
}
