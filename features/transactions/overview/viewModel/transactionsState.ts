import { Status } from "@/shared/types/status.types";
import type {
  TransactionsFormState,
  TransactionsOverviewData,
  TransactionsState,
} from "../types/types";

export const createTransactionsFormState = (): TransactionsFormState => ({
  partyNameInput: "",
  amountInput: "",
  noteInput: "",
});

export const createInitialTransactionsState = (): TransactionsState => ({
  status: Status.Idle,
  isSubmitting: false,
  settlingRecordId: null,
  selectedDirection: "to_receive",
  form: createTransactionsFormState(),
  toReceiveSummary: { totalAmount: 0, openCount: 0 },
  toPaySummary: { totalAmount: 0, openCount: 0 },
  toReceiveItems: [],
  toPayItems: [],
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
  isSubmitting: false,
  settlingRecordId: null,
  toReceiveSummary: data.toReceiveSummary,
  toPaySummary: data.toPaySummary,
  toReceiveItems: data.toReceiveItems,
  toPayItems: data.toPayItems,
  historyItems: data.historyItems,
  errorMessage: "",
});
