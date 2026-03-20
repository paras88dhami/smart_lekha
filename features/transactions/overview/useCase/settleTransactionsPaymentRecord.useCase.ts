import type { TransactionsResult } from "./transactionsError";

export type SettleTransactionsPaymentRecordCommand = {
  recordId: string;
};

export interface SettleTransactionsPaymentRecordUseCase {
  execute(input: SettleTransactionsPaymentRecordCommand): Promise<TransactionsResult<void>>;
}
