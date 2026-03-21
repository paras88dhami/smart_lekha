import { Status } from "@/shared/types/status.types";
import type { TransactionDetailData, TransactionDetailState } from "../types/types";

export const createInitialTransactionDetailState = (): TransactionDetailState => {
  return {
    transactionId: "",
    accountName: null,
    amount: 0,
    occurredAt: Date.now(),
    entryType: "expense",
    categoryName: null,
    counterpartyName: null,
    note: null,
    canEdit: false,
    status: Status.Idle,
    isDeleting: false,
    errorMessage: "",
  };
};

export const createLoadingTransactionDetailState = (
  state: TransactionDetailState,
): TransactionDetailState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createSuccessTransactionDetailState = (
  data: TransactionDetailData,
): TransactionDetailState => {
  return {
    ...data,
    status: Status.Success,
    isDeleting: false,
    errorMessage: "",
  };
};
