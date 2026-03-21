import type { TransactionsEntryFilter } from "../config/transactionHistoryFilterCatalog";
import { ALL_TRANSACTIONS_ACCOUNT_FILTER_ID } from "../config/transactionHistoryFilterCatalog";
import type {
  TransactionsAccountFilterOption,
  TransactionsHistoryItem,
} from "../types/types";

export const filterTransactionsHistoryItems = (
  historyItems: TransactionsHistoryItem[],
  selectedAccountFilterId: string,
  selectedEntryFilter: TransactionsEntryFilter,
): TransactionsHistoryItem[] => {
  return historyItems.filter((historyItem: TransactionsHistoryItem): boolean => {
    const matchesAccount =
      selectedAccountFilterId === ALL_TRANSACTIONS_ACCOUNT_FILTER_ID ||
      historyItem.accountId === selectedAccountFilterId;
    const matchesEntryType =
      selectedEntryFilter === "all" ||
      historyItem.entryType === selectedEntryFilter;

    return matchesAccount && matchesEntryType;
  });
};

export const normalizeTransactionAccountFilterId = (
  selectedAccountFilterId: string,
  accountOptions: TransactionsAccountFilterOption[],
): string => {
  if (selectedAccountFilterId === ALL_TRANSACTIONS_ACCOUNT_FILTER_ID) {
    return selectedAccountFilterId;
  }

  const hasMatchingAccount = accountOptions.some(
    (accountOption: TransactionsAccountFilterOption): boolean => {
      return accountOption.id === selectedAccountFilterId;
    },
  );

  return hasMatchingAccount
    ? selectedAccountFilterId
    : ALL_TRANSACTIONS_ACCOUNT_FILTER_ID;
};
