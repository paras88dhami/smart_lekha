import { FinanceTransactionModel } from "../financeTransaction.model";
import { financeTransactionTable } from "../financeTransaction.schema";

export const financeTransactionDbConfig = {
  models: [FinanceTransactionModel],
  tables: [financeTransactionTable],
};
