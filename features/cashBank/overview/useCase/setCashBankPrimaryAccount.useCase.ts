import type { Result } from "@/shared/types/result.types";

export interface SetCashBankPrimaryAccountUseCase {
  execute(accountId: string): Promise<Result<void>>;
}
