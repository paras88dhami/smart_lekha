import type { TransactionsResult } from "@/features/transactions/overview/useCase/transactionsError";
import type { TransactionFormData } from "../types/types";

export interface LoadTransactionFormUseCase {
  execute(transactionId: string | null): Promise<TransactionsResult<TransactionFormData>>;
}
