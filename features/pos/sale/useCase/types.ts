import type { Result } from "@/shared/types/result.types";
import type { CreatePosSaleInput, PosSale } from "../types/types";

export interface GetRecentPosSalesUseCase {
  execute(profileId: string, limit: number): Promise<Result<PosSale[]>>;
}

export interface CreatePosSaleUseCase {
  execute(input: CreatePosSaleInput): Promise<Result<PosSale>>;
}
