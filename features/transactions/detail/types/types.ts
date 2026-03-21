import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { StatusType } from "@/shared/types/status.types";

export type TransactionDetailData = {
  transactionId: string;
  accountName: string | null;
  amount: number;
  occurredAt: number;
  entryType: FinanceEntryType;
  categoryName: string | null;
  counterpartyName: string | null;
  note: string | null;
  canEdit: boolean;
};

export type TransactionDetailState = TransactionDetailData & {
  status: StatusType;
  isDeleting: boolean;
  errorMessage: string;
};

export interface TransactionDetailViewModel {
  state: TransactionDetailState;
  onRefreshPress(): Promise<void>;
  onEditPress(): void;
  onDeletePress(): Promise<void>;
}
