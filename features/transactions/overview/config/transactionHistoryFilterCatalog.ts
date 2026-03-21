import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";

export const ALL_TRANSACTIONS_ACCOUNT_FILTER_ID = "__all_accounts__";

export type TransactionsEntryFilter = "all" | FinanceEntryType;

export type TransactionsEntryFilterOption = {
  id: TransactionsEntryFilter;
  labelKey: string;
};

export const TRANSACTIONS_ENTRY_FILTER_OPTIONS: TransactionsEntryFilterOption[] = [
  { id: "all", labelKey: "transactions.filterAll" },
  { id: "income", labelKey: "notifications.entryTypes.income" },
  { id: "expense", labelKey: "notifications.entryTypes.expense" },
  { id: "payment_in", labelKey: "notifications.entryTypes.paymentIn" },
  { id: "payment_out", labelKey: "notifications.entryTypes.paymentOut" },
  { id: "transfer_in", labelKey: "notifications.entryTypes.transferIn" },
  { id: "transfer_out", labelKey: "notifications.entryTypes.transferOut" },
  { id: "pos_sale", labelKey: "notifications.entryTypes.posSale" },
];
