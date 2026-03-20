import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemRecord } from "../../types/types";
import type { PosItemModel } from "./posItem.model";

export interface PosItemDataSource {
  getActiveItemsByProfileId(profileId: string): Promise<Result<PosItemModel[]>>;
  createItem(payload: CreatePosItemRecord): Promise<Result<PosItemModel>>;
  updateStock(itemId: string, deltaQuantity: number): Promise<Result<void>>;
}
