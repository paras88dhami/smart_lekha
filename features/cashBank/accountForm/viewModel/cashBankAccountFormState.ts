import { Status } from "@/shared/types/status.types";
import type { CashBankAccountFormData, CashBankAccountFormState } from "../types/types";

export const createInitialCashBankAccountFormState = (): CashBankAccountFormState => {
  return {
    accountId: null,
    profileName: "",
    mode: "create",
    accountNameInput: "",
    accountNumberInput: "",
    openingBalanceInput: "",
    selectedAccountType: "cash",
    currentBalance: 0,
    status: Status.Idle,
    isSubmitting: false,
    isArchiving: false,
    errorMessage: "",
  };
};

export const createLoadingCashBankAccountFormState = (
  state: CashBankAccountFormState,
): CashBankAccountFormState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createSuccessCashBankAccountFormState = (
  data: CashBankAccountFormData,
): CashBankAccountFormState => {
  return {
    ...data,
    status: Status.Success,
    isSubmitting: false,
    isArchiving: false,
    errorMessage: "",
  };
};
