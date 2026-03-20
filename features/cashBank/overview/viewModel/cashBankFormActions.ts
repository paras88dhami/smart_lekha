import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { CashBankState } from "../types/types";

export const toggleCashBankAddAccountForm = (state: CashBankState): CashBankState => {
  return {
    ...state,
    showAddAccountForm: !state.showAddAccountForm,
    errorMessage: "",
  };
};

export const changeCashBankAccountName = (
  state: CashBankState,
  value: string,
): CashBankState => {
  return {
    ...state,
    form: { ...state.form, accountNameInput: value },
    errorMessage: "",
  };
};

export const changeCashBankAccountNumber = (
  state: CashBankState,
  value: string,
): CashBankState => {
  return {
    ...state,
    form: { ...state.form, accountNumberInput: value },
    errorMessage: "",
  };
};

export const changeCashBankOpeningBalance = (
  state: CashBankState,
  value: string,
): CashBankState => {
  return {
    ...state,
    form: { ...state.form, openingBalanceInput: value.replace(/[^0-9.]/g, "") },
    errorMessage: "",
  };
};

export const changeCashBankAccountType = (
  state: CashBankState,
  accountType: FinanceAccountType,
): CashBankState => {
  return {
    ...state,
    form: { ...state.form, selectedAccountType: accountType },
    errorMessage: "",
  };
};
