import { Status } from "@/shared/types/status.types";
import type { SendMoneyFormState, SendMoneyOverviewData, SendMoneyState } from "../types/types";

export const createSendMoneyFormState = (): SendMoneyFormState => {
  return {
    beneficiaryNameInput: "",
    accountNumberInput: "",
    mobileNumberInput: "",
    amountInput: "",
    noteInput: "",
    isScheduled: false,
  };
};

export const createInitialSendMoneyState = (): SendMoneyState => {
  return {
    status: Status.Idle,
    selectedMethod: "same_bank",
    beneficiaries: [],
    favorites: [],
    savedTransfers: [],
    scheduledTransfers: [],
    showAddTransferForm: false,
    form: createSendMoneyFormState(),
    errorMessage: "",
  };
};

export const createLoadingSendMoneyState = (state: SendMoneyState): SendMoneyState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createFailureSendMoneyState = (
  state: SendMoneyState,
  errorMessage: string,
): SendMoneyState => {
  return { ...state, status: Status.Failure, errorMessage };
};

export const createSuccessSendMoneyState = (
  state: SendMoneyState,
  data: SendMoneyOverviewData,
): SendMoneyState => {
  return {
    ...state,
    status: Status.Success,
    beneficiaries: data.beneficiaries,
    favorites: data.favorites,
    savedTransfers: data.savedTransfers,
    scheduledTransfers: data.scheduledTransfers,
    errorMessage: "",
  };
};
