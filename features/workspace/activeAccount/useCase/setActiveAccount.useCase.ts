import type { Result } from "@/shared/types/result.types";

export interface SetActiveAccountUseCase {
  execute(accountId: string): Promise<Result<void>>;
}
