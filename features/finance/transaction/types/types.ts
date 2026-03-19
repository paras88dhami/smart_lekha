import type {
  FinanceEntryStatus,
  FinanceEntryType,
} from "../data/dataSource/financeTransaction.model";

export type FinanceTransaction = {
  id: string;
  profileId: string;
  accountId: string | null;
  entryType: FinanceEntryType;
  categoryName: string | null;
  counterpartyName: string | null;
  note: string | null;
  status: FinanceEntryStatus;
  amount: number;
  occurredAt: number;
  referenceId: string | null;
};

export type CreateFinanceTransactionInput = {
  profileId: string;
  accountId: string | null;
  entryType: FinanceEntryType;
  categoryName: string | null;
  counterpartyName: string | null;
  note: string | null;
  status: FinanceEntryStatus;
  amount: number;
  occurredAt: number;
  referenceId: string | null;
};

export type FinanceSummary = {
  totalInflow: number;
  totalOutflow: number;
  currentNet: number;
  todayInflow: number;
  todayOutflow: number;
};
