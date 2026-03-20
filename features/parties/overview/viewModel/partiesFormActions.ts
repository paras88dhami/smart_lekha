import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import { TRANSFER_METHOD_OPTIONS } from "@/features/transfers/shared/config/transferMethodCatalog";
import type { PartiesState } from "../types/types";

const hasTransferMethod = (method: TransferMethod): boolean => {
  return TRANSFER_METHOD_OPTIONS.some((option) => option.method === method);
};

export const togglePartyForm = (state: PartiesState): PartiesState => {
  return { ...state, showAddPartyForm: !state.showAddPartyForm, errorMessage: "" };
};

export const changePartyName = (state: PartiesState, value: string): PartiesState => {
  return { ...state, form: { ...state.form, partyNameInput: value }, errorMessage: "" };
};

export const changePartyBankName = (state: PartiesState, value: string): PartiesState => {
  return { ...state, form: { ...state.form, bankNameInput: value }, errorMessage: "" };
};

export const changePartyAccountNumber = (
  state: PartiesState,
  value: string,
): PartiesState => {
  return { ...state, form: { ...state.form, accountNumberInput: value }, errorMessage: "" };
};

export const changePartyMobileNumber = (
  state: PartiesState,
  value: string,
): PartiesState => {
  return { ...state, form: { ...state.form, mobileNumberInput: value }, errorMessage: "" };
};

export const changePartyTransferMethod = (
  state: PartiesState,
  method: TransferMethod,
): PartiesState => {
  if (!hasTransferMethod(method)) {
    return state;
  }

  return {
    ...state,
    form: { ...state.form, selectedTransferMethod: method },
    errorMessage: "",
  };
};

export const togglePartyFavorite = (state: PartiesState): PartiesState => {
  return {
    ...state,
    form: { ...state.form, markAsFavorite: !state.form.markAsFavorite },
    errorMessage: "",
  };
};
