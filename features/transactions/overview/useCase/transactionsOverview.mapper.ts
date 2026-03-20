import type { FinanceTransaction } from "@/features/finance/transaction/types/types";
import type { PaymentRecord } from "@/features/transactions/paymentRecord/types/types";
import type {
  TransactionsHistoryItem,
  TransactionsOpenPaymentItem,
  TransactionsOverviewData,
  TransactionsSummary,
} from "../types/types";

const createHistoryTitle = (transaction: FinanceTransaction): string => {
  return (
    transaction.counterpartyName ||
    transaction.categoryName ||
    transaction.note ||
    "Transaction"
  );
};

const mapHistoryItem = (transaction: FinanceTransaction): TransactionsHistoryItem => ({
  id: transaction.id,
  title: createHistoryTitle(transaction),
  occurredAt: transaction.occurredAt,
  amount: transaction.amount,
  entryType: transaction.entryType,
  status: transaction.status,
});

const mapOpenPaymentItem = (record: PaymentRecord): TransactionsOpenPaymentItem => ({
  id: record.id,
  direction: record.direction,
  partyName: record.partyName,
  note: record.note,
  createdAt: record.createdAt,
  outstandingAmount: record.outstandingAmount,
});

const createSummary = (items: TransactionsOpenPaymentItem[]): TransactionsSummary => {
  return items.reduce<TransactionsSummary>(
    (summary, item) => ({
      totalAmount: summary.totalAmount + item.outstandingAmount,
      openCount: summary.openCount + 1,
    }),
    { totalAmount: 0, openCount: 0 },
  );
};

export const mapTransactionsOverviewData = (
  transactions: FinanceTransaction[],
  paymentRecords: PaymentRecord[],
): TransactionsOverviewData => {
  const toReceiveItems = paymentRecords
    .filter((record) => record.direction === "to_receive")
    .map(mapOpenPaymentItem);
  const toPayItems = paymentRecords
    .filter((record) => record.direction === "to_pay")
    .map(mapOpenPaymentItem);

  return {
    toReceiveSummary: createSummary(toReceiveItems),
    toPaySummary: createSummary(toPayItems),
    toReceiveItems,
    toPayItems,
    historyItems: transactions.map(mapHistoryItem),
  };
};
