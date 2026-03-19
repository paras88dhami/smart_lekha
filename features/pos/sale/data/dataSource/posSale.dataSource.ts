import type { Result } from "@/shared/types/result.types";
import type { PosSaleModel } from "./posSale.model";

export interface PosSaleDataSource {
  getRecentByProfileId(profileId: string, limit: number): Promise<Result<PosSaleModel[]>>;
  createSale(payload: PosSaleModel): Promise<Result<PosSaleModel>>;
}
