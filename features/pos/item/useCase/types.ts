import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemInput, PosItem } from "../types/types";

export interface GetPosItemsUseCase {
  execute(profileId: string): Promise<Result<PosItem[]>>;
}

export interface CreatePosItemUseCase {
  execute(input: CreatePosItemInput): Promise<Result<PosItem>>;
}

export interface EnsureDefaultPosItemsUseCase {
  execute(profileId: string): Promise<Result<void>>;
}

export interface UpdatePosItemStockUseCase {
  execute(itemId: string, deltaQuantity: number): Promise<Result<void>>;
}
