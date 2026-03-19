import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemInput, PosItem } from "../../types/types";

export interface PosItemRepository {
  getActiveItemsByProfileId(profileId: string): Promise<Result<PosItem[]>>;
  createItem(input: CreatePosItemInput): Promise<Result<PosItem>>;
  updateStock(itemId: string, deltaQuantity: number): Promise<Result<void>>;
}
