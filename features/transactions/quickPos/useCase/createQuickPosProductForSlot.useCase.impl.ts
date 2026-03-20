import type { CreatePosItemUseCase } from "@/features/pos/item/useCase/createPosItem.useCase";
import type {
  CreateQuickPosProductForSlotInput,
  CreateQuickPosProductForSlotUseCase,
} from "./createQuickPosProductForSlot.useCase";
import type { AssignQuickPosProductSelectionUseCase } from "./assignQuickPosProductSelection.useCase";
import { createQuickPosFailure, type QuickPosResult } from "./quickPosError";

type Params = {
  createPosItemUseCase: CreatePosItemUseCase;
  assignQuickPosProductSelectionUseCase: AssignQuickPosProductSelectionUseCase;
};

const isInvalidProductInput = (input: CreateQuickPosProductForSlotInput): boolean => {
  return (
    input.itemName.trim().length <= 0 ||
    input.unitPrice <= 0 ||
    input.availableStock < 0
  );
};

export const createCreateQuickPosProductForSlotUseCase = ({
  createPosItemUseCase,
  assignQuickPosProductSelectionUseCase,
}: Params): CreateQuickPosProductForSlotUseCase => ({
  async execute(input: CreateQuickPosProductForSlotInput): Promise<QuickPosResult<void>> {
    if (isInvalidProductInput(input)) {
      return createQuickPosFailure("invalidProduct");
    }

    const createProductResult = await createPosItemUseCase.execute({
      profileId: input.profileId,
      itemName: input.itemName.trim(),
      categoryName: null,
      sku: input.sku?.trim() ?? null,
      unitPrice: input.unitPrice,
      availableStock: input.availableStock,
      isActive: true,
    });

    if (!createProductResult.success) {
      return createQuickPosFailure("productCreateFailed", createProductResult.error);
    }

    return assignQuickPosProductSelectionUseCase.execute({
      profileId: input.profileId,
      slotId: input.slotId,
      itemId: createProductResult.value.id,
    });
  },
});
