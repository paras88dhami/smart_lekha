import type { Result } from "@/shared/types/result.types";

export interface ArchiveFinanceAccountUseCase {
  execute(accountId: string): Promise<Result<void>>;
}
