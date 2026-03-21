import type { FinanceTransaction } from "@/features/finance/transaction/types/types";
import type { FinanceAccount } from "@/features/finance/account/types/types";
import type { PaymentRecord } from "@/features/transactions/paymentRecord/types/types";
import type {
  TransactionsAccountFilterOption,
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
  accountId: transaction.accountId,
  accountName: null,
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

const mapAccountFilterOption = (
  account: FinanceAccount,
): TransactionsAccountFilterOption => {
  return {
    id: account.id,
    accountName: account.accountName,
  };
};

export const mapTransactionsOverviewData = (
  transactions: FinanceTransaction[],
  paymentRecords: PaymentRecord[],
  accounts: FinanceAccount[],
  profileName: string,
): TransactionsOverviewData => {
  const accountNameById = new Map<string, string>(
    accounts.map((account: FinanceAccount): [string, string] => {
      return [account.id, account.accountName];
    }),
  );
  const toReceiveItems = paymentRecords
    .filter((record) => record.direction === "to_receive")
    .map(mapOpenPaymentItem);
  const toPayItems = paymentRecords
    .filter((record) => record.direction === "to_pay")
    .map(mapOpenPaymentItem);

  return {
    profileName,
    accountOptions: accounts.map(mapAccountFilterOption),
    toReceiveSummary: createSummary(toReceiveItems),
    toPaySummary: createSummary(toPayItems),
    toReceiveItems,
    toPayItems,
    historyItems: transactions.map((transaction: FinanceTransaction): TransactionsHistoryItem => {
      const historyItem = mapHistoryItem(transaction);
      const accountName = historyItem.accountId
        ? accountNameById.get(historyItem.accountId) ?? null
        : null;

      return {
        ...historyItem,
        accountName,
      };
    }),
  };
};
