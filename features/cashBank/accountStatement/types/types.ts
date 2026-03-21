import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { StatusType } from "@/shared/types/status.types";

export type CashBankStatementItem = {
  id: string;
  title: string;
  amount: number;
  occurredAt: number;
  entryType: FinanceEntryType;
  note: string | null;
};

export type CashBankAccountStatementData = {
  accountId: string;
  accountName: string;
  accountNumber: string | null;
  currentBalance: number;
  currencyCode: string;
  statementItems: CashBankStatementItem[];
};

export type CashBankAccountStatementState = {
  status: StatusType;
  accountId: string;
  accountName: string;
  accountNumber: string | null;
  currentBalance: number;
  currencyCode: string;
  statementItems: CashBankStatementItem[];
  errorMessage: string;
};

export interface CashBankAccountStatementViewModel {
  state: CashBankAccountStatementState;
  onRefreshPress(): Promise<void>;
  onTransactionPress(transactionId: string): void;
}
