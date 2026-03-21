import { Status } from "@/shared/types/status.types";
import type { CashBankOverviewData, CashBankState } from "../types/types";

export const createInitialCashBankState = (): CashBankState => {
  return {
    status: Status.Idle,
    profileName: "",
    accounts: [],
    errorMessage: "",
  };
};

export const createLoadingCashBankState = (state: CashBankState): CashBankState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createFailureCashBankState = (
  state: CashBankState,
  errorMessage: string,
): CashBankState => {
  return { ...state, status: Status.Failure, errorMessage };
};

export const createSuccessCashBankState = (
  state: CashBankState,
  data: CashBankOverviewData,
): CashBankState => {
  return {
    ...state,
    status: Status.Success,
    profileName: data.profileName,
    accounts: data.accounts,
    errorMessage: "",
  };
};
