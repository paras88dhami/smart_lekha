import { Status } from "@/shared/types/status.types";
import { ALL_TRANSACTIONS_ACCOUNT_FILTER_ID } from "../config/transactionHistoryFilterCatalog";
import type {
  TransactionsFormState,
  TransactionsOverviewData,
  TransactionsState,
} from "../types/types";
import {
  filterTransactionsHistoryItems,
  normalizeTransactionAccountFilterId,
} from "./transactionsHistoryFilter";

export const createTransactionsFormState = (): TransactionsFormState => ({
  partyNameInput: "",
  amountInput: "",
  noteInput: "",
});

export const createInitialTransactionsState = (): TransactionsState => ({
  status: Status.Idle,
  profileName: "",
  isSubmitting: false,
  settlingRecordId: null,
  selectedDirection: "to_receive",
  selectedAccountFilterId: ALL_TRANSACTIONS_ACCOUNT_FILTER_ID,
  selectedEntryFilter: "all",
  accountOptions: [],
  form: createTransactionsFormState(),
  toReceiveSummary: { totalAmount: 0, openCount: 0 },
  toPaySummary: { totalAmount: 0, openCount: 0 },
  toReceiveItems: [],
  toPayItems: [],
  allHistoryItems: [],
  historyItems: [],
  errorMessage: "",
});

export const createLoadingTransactionsState = (
  state: TransactionsState,
): TransactionsState => ({
  ...state,
  status: Status.Loading,
  errorMessage: "",
});

export const createFailureTransactionsState = (
  state: TransactionsState,
  errorMessage: string,
): TransactionsState => ({
  ...state,
  status: Status.Failure,
  isSubmitting: false,
  settlingRecordId: null,
  errorMessage,
});

export const createSuccessTransactionsState = (
  state: TransactionsState,
  data: TransactionsOverviewData,
): TransactionsState => ({
  ...state,
  status: Status.Success,
  profileName: data.profileName,
  isSubmitting: false,
  settlingRecordId: null,
  accountOptions: data.accountOptions,
  toReceiveSummary: data.toReceiveSummary,
  toPaySummary: data.toPaySummary,
  toReceiveItems: data.toReceiveItems,
  toPayItems: data.toPayItems,
  allHistoryItems: data.historyItems,
  historyItems: filterTransactionsHistoryItems(
    data.historyItems,
    normalizeTransactionAccountFilterId(state.selectedAccountFilterId, data.accountOptions),
    state.selectedEntryFilter,
  ),
  selectedAccountFilterId: normalizeTransactionAccountFilterId(
    state.selectedAccountFilterId,
    data.accountOptions,
  ),
  errorMessage: "",
});
