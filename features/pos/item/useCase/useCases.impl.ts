import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemInput, PosItem } from "../types/types";
import type { PosItemRepository } from "../data/repository/posItem.repository";
import type {
  CreatePosItemUseCase,
  EnsureDefaultPosItemsUseCase,
  GetPosItemsUseCase,
  UpdatePosItemStockUseCase,
} from "./types";

const DEFAULT_POS_ITEMS: Omit<CreatePosItemInput, "profileId">[] = [
  {
    itemName: "Tea",
    sku: "TEA-001",
    unitPrice: 30,
    availableStock: 100,
    isActive: true,
  },
  {
    itemName: "Coffee",
    sku: "COF-001",
    unitPrice: 90,
    availableStock: 80,
    isActive: true,
  },
  {
    itemName: "Snacks",
    sku: "SNK-001",
    unitPrice: 50,
    availableStock: 120,
    isActive: true,
  },
];

export const createGetPosItemsUseCase = (
  repository: PosItemRepository,
): GetPosItemsUseCase => ({
  async execute(profileId: string): Promise<Result<PosItem[]>> {
    return repository.getActiveItemsByProfileId(profileId);
  },
});

export const createCreatePosItemUseCase = (
  repository: PosItemRepository,
): CreatePosItemUseCase => ({
  async execute(input: CreatePosItemInput): Promise<Result<PosItem>> {
    return repository.createItem(input);
  },
});

export const createEnsureDefaultPosItemsUseCase = (
  repository: PosItemRepository,
): EnsureDefaultPosItemsUseCase => ({
  async execute(profileId: string): Promise<Result<void>> {
    const existingItemsResult = await repository.getActiveItemsByProfileId(profileId);

    if (!existingItemsResult.success) {
      return {
        success: false,
        error: existingItemsResult.error,
      };
    }

    if (existingItemsResult.value.length > 0) {
      return {
        success: true,
        value: undefined,
      };
    }

    for (const item of DEFAULT_POS_ITEMS) {
      const createResult = await repository.createItem({
        profileId,
        ...item,
      });

      if (!createResult.success) {
        return {
          success: false,
          error: createResult.error,
        };
      }
    }

    return {
      success: true,
      value: undefined,
    };
  },
});

export const createUpdatePosItemStockUseCase = (
  repository: PosItemRepository,
): UpdatePosItemStockUseCase => ({
  async execute(itemId: string, deltaQuantity: number): Promise<Result<void>> {
    return repository.updateStock(itemId, deltaQuantity);
  },
});
