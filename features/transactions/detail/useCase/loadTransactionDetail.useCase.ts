import type { TransactionsResult } from "@/features/transactions/overview/useCase/transactionsError";
import type { TransactionDetailData } from "../types/types";

export interface LoadTransactionDetailUseCase {
  execute(transactionId: string): Promise<TransactionsResult<TransactionDetailData>>;
}
