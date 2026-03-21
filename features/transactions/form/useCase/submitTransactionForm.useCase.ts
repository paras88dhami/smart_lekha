import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { TransactionsResult } from "@/features/transactions/overview/useCase/transactionsError";

export type SubmitTransactionFormCommand = {
  transactionId: string | null;
  selectedAccountId: string;
  selectedEntryType: FinanceEntryType;
  amountInput: string;
  categoryInput: string;
  counterpartyInput: string;
  noteInput: string;
  occurredOnInput: string;
};

export interface SubmitTransactionFormUseCase {
  execute(command: SubmitTransactionFormCommand): Promise<TransactionsResult<void>>;
}
