import type { PaymentRecordDirection } from "@/features/transactions/paymentRecord/data/dataSource/paymentRecord.model";
import type { TransactionsResult } from "./transactionsError";

export type CreateTransactionsPaymentRecordCommand = {
  direction: PaymentRecordDirection;
  partyNameInput: string;
  amountInput: string;
  noteInput: string;
};

export interface CreateTransactionsPaymentRecordUseCase {
  execute(input: CreateTransactionsPaymentRecordCommand): Promise<TransactionsResult<void>>;
}
