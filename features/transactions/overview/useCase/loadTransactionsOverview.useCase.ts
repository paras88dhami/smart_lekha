import type { TransactionsOverviewData } from "../types/types";
import type { TransactionsResult } from "./transactionsError";

export interface LoadTransactionsOverviewUseCase {
  execute(): Promise<TransactionsResult<TransactionsOverviewData>>;
}
