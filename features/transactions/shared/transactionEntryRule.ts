import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { FinanceTransaction } from "@/features/finance/transaction/types/types";

export const MANUAL_TRANSACTION_ENTRY_TYPES: FinanceEntryType[] = [
  "income",
  "expense",
  "payment_in",
  "payment_out",
  "transfer_in",
  "transfer_out",
];

export const getFinanceTransactionBalanceDelta = (
  entryType: FinanceEntryType,
  amount: number,
): number => {
  if (
    entryType === "income" ||
    entryType === "payment_in" ||
    entryType === "transfer_in" ||
    entryType === "pos_sale"
  ) {
    return amount;
  }

  return amount * -1;
};

export const isManualFinanceTransactionEditable = (
  transaction: FinanceTransaction,
): boolean => {
  return transaction.referenceId === null && transaction.entryType !== "pos_sale";
};
