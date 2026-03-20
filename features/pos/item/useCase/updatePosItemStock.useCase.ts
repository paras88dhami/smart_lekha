import type { Result } from "@/shared/types/result.types";

export type UpdatePosItemStockInput = {
  itemId: string;
  deltaQuantity: number;
};

export interface UpdatePosItemStockUseCase {
  execute(input: UpdatePosItemStockInput): Promise<Result<void>>;
}
