import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import { SEND_MONEY_METHOD_OPTIONS } from "../config/transferMethodCatalog";
import type { SendMoneyState } from "../types/types";

const hasMethodOption = (method: TransferMethod): boolean => {
  return SEND_MONEY_METHOD_OPTIONS.some((option) => option.method === method);
};

export const selectSendMoneyMethod = (
  state: SendMoneyState,
  method: TransferMethod,
): SendMoneyState => {
  if (!hasMethodOption(method)) {
    return state;
  }

  return { ...state, selectedMethod: method, errorMessage: "" };
};

export const toggleSendMoneyForm = (state: SendMoneyState): SendMoneyState => {
  return {
    ...state,
    showAddTransferForm: !state.showAddTransferForm,
    errorMessage: "",
  };
};

export const changeSendMoneyBeneficiaryName = (
  state: SendMoneyState,
  value: string,
): SendMoneyState => {
  return {
    ...state,
    form: { ...state.form, beneficiaryNameInput: value },
    errorMessage: "",
  };
};

export const changeSendMoneyAccountNumber = (
  state: SendMoneyState,
  value: string,
): SendMoneyState => {
  return {
    ...state,
    form: { ...state.form, accountNumberInput: value },
    errorMessage: "",
  };
};

export const changeSendMoneyMobileNumber = (
  state: SendMoneyState,
  value: string,
): SendMoneyState => {
  return {
    ...state,
    form: { ...state.form, mobileNumberInput: value },
    errorMessage: "",
  };
};

export const changeSendMoneyAmount = (
  state: SendMoneyState,
  value: string,
): SendMoneyState => {
  return {
    ...state,
    form: { ...state.form, amountInput: value.replace(/[^0-9.]/g, "") },
    errorMessage: "",
  };
};

export const changeSendMoneyNote = (
  state: SendMoneyState,
  value: string,
): SendMoneyState => {
  return {
    ...state,
    form: { ...state.form, noteInput: value },
    errorMessage: "",
  };
};

export const toggleSendMoneySchedule = (state: SendMoneyState): SendMoneyState => {
  return {
    ...state,
    form: { ...state.form, isScheduled: !state.form.isScheduled },
    errorMessage: "",
  };
};
