import type { Result } from "@/shared/types/result.types";

export type TransactionsErrorCode =
  | "invalidAmount"
  | "invalidPartyName"
  | "noAccountSelected"
  | "loadFailed"
  | "noActiveProfile"
  | "noPrimaryAccount"
  | "recordNotFound"
  | "transactionNotFound"
  | "editLocked"
  | "saveFailed"
  | "updateFailed"
  | "deleteFailed"
  | "settleFailed";

export type TransactionsError = {
  code: TransactionsErrorCode;
  cause: Error | null;
};

export type TransactionsResult<T> = Result<T, TransactionsError>;

export const createTransactionsFailure = <T>(
  code: TransactionsErrorCode,
  cause: Error | null = null,
): TransactionsResult<T> => ({
  success: false,
  error: {
    code,
    cause,
  },
});
