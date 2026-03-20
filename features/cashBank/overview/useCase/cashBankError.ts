export type CashBankErrorCode =
  | "no_active_profile"
  | "load_failed"
  | "invalid_name"
  | "invalid_opening_balance"
  | "create_failed"
  | "set_primary_failed";

export class CashBankError extends Error {
  readonly code: CashBankErrorCode;

  constructor(code: CashBankErrorCode) {
    super(code);
    this.code = code;
  }
}

export const createCashBankError = (code: CashBankErrorCode): CashBankError => {
  return new CashBankError(code);
};
