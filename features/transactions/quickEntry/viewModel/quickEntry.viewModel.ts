import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { StatusType } from "@/shared/types/status.types";

export type QuickEntryItem = {
  id: string;
  title: string;
  occurredAt: number;
  amount: number;
  entryType: FinanceEntryType;
};

export type QuickEntryState = {
  status: StatusType;
  profileName: string;
  selectedEntryType: FinanceEntryType;
  categoryInput: string;
  counterpartyInput: string;
  amountInput: string;
  noteInput: string;
  recentEntries: QuickEntryItem[];
  errorMessage: string;
};

export interface QuickEntryViewModel {
  state: QuickEntryState;
  onRefreshPress(): Promise<void>;
  onEntryTypePress(entryType: FinanceEntryType): void;
  onCategoryChange(value: string): void;
  onCounterpartyChange(value: string): void;
  onAmountChange(value: string): void;
  onNoteChange(value: string): void;
  onSavePress(): Promise<void>;
}
