import type { Result } from "@/shared/types/result.types";
import type { PosSale } from "../types/types";

export interface GetRecentPosSalesUseCase {
  execute(profileId: string, limit: number): Promise<Result<PosSale[]>>;
}
