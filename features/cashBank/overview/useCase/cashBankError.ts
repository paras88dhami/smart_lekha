export type CashBankErrorCode =
  | "no_active_profile"
  | "load_failed"
  | "account_not_found"
  | "invalid_name"
  | "invalid_opening_balance"
  | "create_failed"
  | "update_failed"
  | "archive_failed"
  | "set_primary_failed"
  | "cannot_archive_primary"
  | "cannot_archive_with_balance";

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
