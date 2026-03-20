import type { Result } from "@/shared/types/result.types";
import type { PosItemRepository } from "../data/repository/posItem.repository";
import type {
  UpdatePosItemStockInput,
  UpdatePosItemStockUseCase,
} from "./updatePosItemStock.useCase";

export const createUpdatePosItemStockUseCase = (
  repository: PosItemRepository,
): UpdatePosItemStockUseCase => ({
  async execute(input: UpdatePosItemStockInput): Promise<Result<void>> {
    return repository.updateStock(input.itemId, input.deltaQuantity);
  },
});
