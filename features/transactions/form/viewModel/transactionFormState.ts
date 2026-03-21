import { Status } from "@/shared/types/status.types";
import type { TransactionFormData, TransactionFormState } from "../types/types";

export const createInitialTransactionFormState = (): TransactionFormState => {
  return {
    transactionId: null,
    profileName: "",
    selectedAccountId: "",
    selectedEntryType: "expense",
    amountInput: "",
    categoryInput: "",
    counterpartyInput: "",
    noteInput: "",
    occurredOnInput: "",
    accountOptions: [],
    status: Status.Idle,
    isSubmitting: false,
    errorMessage: "",
  };
};

export const createLoadingTransactionFormState = (
  state: TransactionFormState,
): TransactionFormState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createSuccessTransactionFormState = (
  data: TransactionFormData,
): TransactionFormState => {
  return {
    ...data,
    status: Status.Success,
    isSubmitting: false,
    errorMessage: "",
  };
};
