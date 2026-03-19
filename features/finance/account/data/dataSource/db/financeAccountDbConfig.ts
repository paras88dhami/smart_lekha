import { FinanceAccountModel } from "../financeAccount.model";
import { financeAccountTable } from "../financeAccount.schema";

export const financeAccountDbConfig = {
  models: [FinanceAccountModel],
  tables: [financeAccountTable],
};
