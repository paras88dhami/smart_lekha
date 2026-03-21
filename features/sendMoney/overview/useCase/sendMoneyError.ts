export type SendMoneyErrorCode =
  | "no_active_profile"
  | "load_failed"
  | "invalid_beneficiary"
  | "invalid_amount"
  | "invalid_source_account"
  | "invalid_destination_account"
  | "same_account_transfer"
  | "save_failed";

export class SendMoneyError extends Error {
  readonly code: SendMoneyErrorCode;

  constructor(code: SendMoneyErrorCode) {
    super(code);
    this.code = code;
  }
}

export const createSendMoneyError = (code: SendMoneyErrorCode): SendMoneyError => {
  return new SendMoneyError(code);
};
