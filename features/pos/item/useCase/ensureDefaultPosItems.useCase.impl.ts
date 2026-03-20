import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemInput } from "../types/types";
import type { PosItemRepository } from "../data/repository/posItem.repository";
import type {
  EnsureDefaultPosItemsInput,
  EnsureDefaultPosItemsUseCase,
} from "./ensureDefaultPosItems.useCase";

const DEFAULT_POS_ITEMS: Omit<CreatePosItemInput, "profileId">[] = [
  {
    itemName: "Tea",
    categoryName: "Hot Drinks",
    sku: "TEA-001",
    unitPrice: 30,
    availableStock: 100,
    isActive: true,
  },
  {
    itemName: "Coffee",
    categoryName: "Hot Drinks",
    sku: "COF-001",
    unitPrice: 90,
    availableStock: 80,
    isActive: true,
  },
  {
    itemName: "Lemon Soda",
    categoryName: "Cold Drinks",
    sku: "SOD-001",
    unitPrice: 120,
    availableStock: 70,
    isActive: true,
  },
  {
    itemName: "Veg Burger",
    categoryName: "Fast Food",
    sku: "BRG-001",
    unitPrice: 180,
    availableStock: 40,
    isActive: true,
  },
  {
    itemName: "Chicken Pizza",
    categoryName: "Fast Food",
    sku: "PIZ-001",
    unitPrice: 450,
    availableStock: 25,
    isActive: true,
  },
  {
    itemName: "Chips",
    categoryName: "Snacks",
    sku: "SNK-001",
    unitPrice: 60,
    availableStock: 120,
    isActive: true,
  },
];

const createFailure = (error: Error): Result<void> => ({
  success: false,
  error,
});

export const createEnsureDefaultPosItemsUseCase = (
  repository: PosItemRepository,
): EnsureDefaultPosItemsUseCase => ({
  async execute(input: EnsureDefaultPosItemsInput): Promise<Result<void>> {
    const existingItemsResult = await repository.getActiveItemsByProfileId(input.profileId);

    if (!existingItemsResult.success) {
      return createFailure(existingItemsResult.error);
    }

    if (existingItemsResult.value.length > 0) {
      return {
        success: true,
        value: undefined,
      };
    }

    for (const item of DEFAULT_POS_ITEMS) {
      const createItemResult = await repository.createItem({
        profileId: input.profileId,
        ...item,
      });

      if (!createItemResult.success) {
        return createFailure(createItemResult.error);
      }
    }

    return {
      success: true,
      value: undefined,
    };
  },
});
