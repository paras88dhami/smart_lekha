import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { StatusType } from "@/shared/types/status.types";

export type TransactionsListItem = {
  id: string;
  title: string;
  subtitle: string;
  occurredAt: number;
  amount: number;
  entryType: FinanceEntryType;
  statusLabel: string;
};

export type TransactionsState = {
  status: StatusType;
  transactions: TransactionsListItem[];
  selectedEntryType: "payment_in" | "payment_out";
  amountInput: string;
  noteInput: string;
  errorMessage: string;
};

export interface TransactionsViewModel {
  state: TransactionsState;
  onRefreshPress(): Promise<void>;
  onEntryTypePress(entryType: "payment_in" | "payment_out"): void;
  onAmountChange(value: string): void;
  onNoteChange(value: string): void;
  onAddEntryPress(): Promise<void>;
  onQuickPosPress(): void;
}
