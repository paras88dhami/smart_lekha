import type { Result } from "@/shared/types/result.types";

export type QuickPosErrorCode =
  | "checkoutFailed"
  | "emptyCart"
  | "insufficientStock"
  | "invalidProduct"
  | "invalidReceivingAccount"
  | "loadFailed"
  | "noActiveProfile"
  | "noPrimaryAccount"
  | "productAlreadyPinned"
  | "productCreateFailed"
  | "slotSaveFailed"
  | "stockUpdateFailed";

export type QuickPosError = {
  code: QuickPosErrorCode;
  cause: Error | null;
};

export type QuickPosResult<T> = Result<T, QuickPosError>;

export const createQuickPosFailure = <T>(
  code: QuickPosErrorCode,
  cause: Error | null = null,
): QuickPosResult<T> => ({
  success: false,
  error: {
    code,
    cause,
  },
});
