import type {
  FinanceEntryStatus,
  FinanceEntryType,
} from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { TransactionsEntryFilter } from "../config/transactionHistoryFilterCatalog";
import type { StatusType } from "@/shared/types/status.types";
import type { PaymentRecordDirection } from "@/features/transactions/paymentRecord/data/dataSource/paymentRecord.model";

export type TransactionsHistoryItem = {
  id: string;
  title: string;
  accountId: string | null;
  accountName: string | null;
  occurredAt: number;
  amount: number;
  entryType: FinanceEntryType;
  status: FinanceEntryStatus;
};

export type TransactionsOpenPaymentItem = {
  id: string;
  direction: PaymentRecordDirection;
  partyName: string;
  note: string | null;
  createdAt: number;
  outstandingAmount: number;
};

export type TransactionsSummary = {
  totalAmount: number;
  openCount: number;
};

export type TransactionsAccountFilterOption = {
  id: string;
  accountName: string;
};

export type TransactionsOverviewData = {
  profileName: string;
  accountOptions: TransactionsAccountFilterOption[];
  toReceiveSummary: TransactionsSummary;
  toPaySummary: TransactionsSummary;
  toReceiveItems: TransactionsOpenPaymentItem[];
  toPayItems: TransactionsOpenPaymentItem[];
  historyItems: TransactionsHistoryItem[];
};

export type TransactionsFormState = {
  partyNameInput: string;
  amountInput: string;
  noteInput: string;
};

export type TransactionsState = {
  status: StatusType;
  profileName: string;
  isSubmitting: boolean;
  settlingRecordId: string | null;
  selectedDirection: PaymentRecordDirection;
  selectedAccountFilterId: string;
  selectedEntryFilter: TransactionsEntryFilter;
  accountOptions: TransactionsAccountFilterOption[];
  form: TransactionsFormState;
  toReceiveSummary: TransactionsSummary;
  toPaySummary: TransactionsSummary;
  toReceiveItems: TransactionsOpenPaymentItem[];
  toPayItems: TransactionsOpenPaymentItem[];
  allHistoryItems: TransactionsHistoryItem[];
  historyItems: TransactionsHistoryItem[];
  errorMessage: string;
};

export interface TransactionsViewModel {
  state: TransactionsState;
  onRefreshPress(): Promise<void>;
  onAddTransactionPress(): void;
  onDirectionPress(direction: PaymentRecordDirection): void;
  onAccountFilterPress(accountId: string): void;
  onEntryFilterPress(entryFilter: TransactionsEntryFilter): void;
  onPartyNameChange(value: string): void;
  onAmountChange(value: string): void;
  onNoteChange(value: string): void;
  onCreatePaymentPress(): Promise<void>;
  onSettlePaymentPress(recordId: string): Promise<void>;
  onQuickPosPress(): void;
  onTransactionPress(transactionId: string): void;
}
