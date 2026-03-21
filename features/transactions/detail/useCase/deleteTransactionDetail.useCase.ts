import type { TransactionsResult } from "@/features/transactions/overview/useCase/transactionsError";

export interface DeleteTransactionDetailUseCase {
  execute(transactionId: string): Promise<TransactionsResult<void>>;
}
