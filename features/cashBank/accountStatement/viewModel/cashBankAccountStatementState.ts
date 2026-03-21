import { Status } from "@/shared/types/status.types";
import type {
  CashBankAccountStatementData,
  CashBankAccountStatementState,
} from "../types/types";

export const createInitialCashBankAccountStatementState = (): CashBankAccountStatementState => {
  return {
    status: Status.Idle,
    accountId: "",
    accountName: "",
    accountNumber: null,
    currentBalance: 0,
    currencyCode: "NPR",
    statementItems: [],
    errorMessage: "",
  };
};

export const createLoadingCashBankAccountStatementState = (
  state: CashBankAccountStatementState,
): CashBankAccountStatementState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createSuccessCashBankAccountStatementState = (
  data: CashBankAccountStatementData,
): CashBankAccountStatementState => {
  return {
    status: Status.Success,
    accountId: data.accountId,
    accountName: data.accountName,
    accountNumber: data.accountNumber,
    currentBalance: data.currentBalance,
    currencyCode: data.currencyCode,
    statementItems: data.statementItems,
    errorMessage: "",
  };
};
