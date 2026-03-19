import type { Result } from "@/shared/types/result.types";

export interface SetPrimaryFinanceAccountUseCase {
  execute(accountId: string): Promise<Result<void>>;
}
