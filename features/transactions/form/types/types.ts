import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { StatusType } from "@/shared/types/status.types";

export type TransactionFormAccountOption = {
  id: string;
  accountName: string;
};

export type TransactionFormData = {
  transactionId: string | null;
  profileName: string;
  selectedAccountId: string;
  selectedEntryType: FinanceEntryType;
  amountInput: string;
  categoryInput: string;
  counterpartyInput: string;
  noteInput: string;
  occurredOnInput: string;
  accountOptions: TransactionFormAccountOption[];
};

export type TransactionFormState = TransactionFormData & {
  status: StatusType;
  isSubmitting: boolean;
  errorMessage: string;
};

export interface TransactionFormViewModel {
  state: TransactionFormState;
  onRefreshPress(): Promise<void>;
  onAccountPress(accountId: string): void;
  onEntryTypePress(entryType: FinanceEntryType): void;
  onAmountChange(value: string): void;
  onCategoryChange(value: string): void;
  onCounterpartyChange(value: string): void;
  onNoteChange(value: string): void;
  onOccurredOnChange(value: string): void;
  onSavePress(): Promise<void>;
}
