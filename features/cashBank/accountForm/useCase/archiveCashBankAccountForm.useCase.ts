import type { Result } from "@/shared/types/result.types";

export interface ArchiveCashBankAccountFormUseCase {
  execute(accountId: string | null): Promise<Result<void>>;
}
