import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { StatusType } from "@/shared/types/status.types";

export type CashBankAccountFormData = {
  accountId: string | null;
  profileName: string;
  mode: "create" | "edit";
  accountNameInput: string;
  accountNumberInput: string;
  openingBalanceInput: string;
  selectedAccountType: FinanceAccountType;
  currentBalance: number;
};

export type CashBankAccountFormState = CashBankAccountFormData & {
  status: StatusType;
  isSubmitting: boolean;
  isArchiving: boolean;
  errorMessage: string;
};

export interface CashBankAccountFormViewModel {
  state: CashBankAccountFormState;
  onRefreshPress(): Promise<void>;
  onAccountNameChange(value: string): void;
  onAccountNumberChange(value: string): void;
  onOpeningBalanceChange(value: string): void;
  onAccountTypePress(accountType: FinanceAccountType): void;
  onSavePress(): Promise<void>;
  onArchivePress(): Promise<void>;
}
