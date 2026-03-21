import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type { TransferRecordTargetType } from "@/features/transfers/record/data/dataSource/transferRecord.model";
import {
  TRANSFER_METHOD_OPTIONS,
  getTransferMethodInputConfig,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import type { SendMoneyState } from "../types/types";

const findFallbackDestinationAccountId = (
  sourceAccountId: string,
  state: SendMoneyState,
): string => {
  return state.accounts.find((account) => account.id !== sourceAccountId)?.id ?? "";
};

const hasMethodOption = (method: TransferMethod): boolean => {
  return TRANSFER_METHOD_OPTIONS.some((option) => option.method === method);
};

export const selectSendMoneyMethod = (
  state: SendMoneyState,
  method: TransferMethod,
): SendMoneyState => {
  if (!hasMethodOption(method)) {
    return state;
  }

  const inputConfig = getTransferMethodInputConfig(method);

  return {
    ...state,
    selectedMethod: method,
    form: {
      ...state.form,
      accountNumberInput: inputConfig.showsAccountNumberInput
        ? state.form.accountNumberInput
        : "",
      mobileNumberInput: inputConfig.showsMobileNumberInput
        ? state.form.mobileNumberInput
        : "",
    },
    errorMessage: "",
  };
};

export const toggleSendMoneyForm = (state: SendMoneyState): SendMoneyState => {
  return {
    ...state,
    showAddTransferForm: !state.showAddTransferForm,
    errorMessage: "",
  };
};

export const selectSendMoneyTargetType = (
  state: SendMoneyState,
  targetType: TransferRecordTargetType,
): SendMoneyState => {
  const destinationAccountId =
    targetType === "own_account"
      ? state.form.destinationAccountId ||
        findFallbackDestinationAccountId(state.form.sourceAccountId, state)
      : "";

  return {
    ...state,
    form: {
      ...state.form,
      targetType,
      destinationAccountId,
      beneficiaryNameInput: targetType === "beneficiary" ? state.form.beneficiaryNameInput : "",
      accountNumberInput: targetType === "beneficiary" ? state.form.accountNumberInput : "",
      mobileNumberInput: targetType === "beneficiary" ? state.form.mobileNumberInput : "",
    },
    errorMessage: "",
  };
};

export const selectSendMoneySourceAccount = (
  state: SendMoneyState,
  sourceAccountId: string,
): SendMoneyState => {
  const destinationAccountId =
    state.form.targetType === "own_account" && state.form.destinationAccountId === sourceAccountId
      ? findFallbackDestinationAccountId(sourceAccountId, state)
      : state.form.destinationAccountId;

  return {
    ...state,
    form: {
      ...state.form,
      sourceAccountId,
      destinationAccountId,
    },
    errorMessage: "",
  };
};

export const selectSendMoneyDestinationAccount = (
  state: SendMoneyState,
  destinationAccountId: string,
): SendMoneyState => {
  return {
    ...state,
    form: {
      ...state.form,
      destinationAccountId,
    },
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
