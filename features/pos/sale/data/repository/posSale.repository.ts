import type { Result } from "@/shared/types/result.types";
import type { CreatePosSaleInput, PosSale } from "../../types/types";

export interface PosSaleRepository {
  getRecentByProfileId(profileId: string, limit: number): Promise<Result<PosSale[]>>;
  createSale(input: CreatePosSaleInput): Promise<Result<PosSale>>;
}
