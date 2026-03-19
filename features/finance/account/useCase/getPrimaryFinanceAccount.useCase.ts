import type { Result } from "@/shared/types/result.types";
import type { FinanceAccount } from "../types/types";

export interface GetPrimaryFinanceAccountUseCase {
  execute(profileId: string): Promise<Result<FinanceAccount | null>>;
}
