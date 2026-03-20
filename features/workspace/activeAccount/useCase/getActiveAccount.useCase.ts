import type { Result } from "@/shared/types/result.types";
import type { FinanceAccount } from "@/features/finance/account/types/types";

export interface GetActiveAccountUseCase {
  execute(): Promise<Result<FinanceAccount | null>>;
}
