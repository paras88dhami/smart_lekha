import type { Result } from "@/shared/types/result.types";
import type {
  CreateQuickPosProductSlotInput,
  QuickPosProductSlot,
  UpdateQuickPosProductSlotItemInput,
} from "../../types/types";
import type { QuickPosProductSlotDataSource } from "../dataSource/quickPosProductSlot.dataSource";
import type { QuickPosProductSlotModel } from "../dataSource/quickPosProductSlot.model";
import type { QuickPosProductSlotRepository } from "./quickPosProductSlot.repository";

const mapProductSlot = (record: QuickPosProductSlotModel): QuickPosProductSlot => ({
  id: record.id,
  profileId: record.profileId.trim(),
  categoryName: record.categoryName.trim(),
  slotOrder: record.slotOrder,
  itemId: record.itemId?.trim() ?? null,
});

const normalizeCreateSlotInput = (
  input: CreateQuickPosProductSlotInput,
): CreateQuickPosProductSlotInput => {
  return {
    profileId: input.profileId.trim(),
    categoryName: input.categoryName.trim(),
    slotOrder: input.slotOrder,
    itemId: input.itemId?.trim() ?? null,
  };
};

const normalizeUpdateInput = (
  input: UpdateQuickPosProductSlotItemInput,
): UpdateQuickPosProductSlotItemInput => {
  return {
    slotId: input.slotId.trim(),
    itemId: input.itemId?.trim() ?? null,
  };
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createQuickPosProductSlotRepository = (
  localDataSource: QuickPosProductSlotDataSource,
): QuickPosProductSlotRepository => ({
  async getSlotsByProfileId(profileId: string): Promise<Result<QuickPosProductSlot[]>> {
    const result = await localDataSource.getSlotsByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<QuickPosProductSlot[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapProductSlot),
    };
  },

  async createSlot(
    input: CreateQuickPosProductSlotInput,
  ): Promise<Result<QuickPosProductSlot>> {
    const result = await localDataSource.createSlot(normalizeCreateSlotInput(input));

    if (!result.success) {
      return createFailure<QuickPosProductSlot>(result.error);
    }

    return {
      success: true,
      value: mapProductSlot(result.value),
    };
  },

  async updateSlotItem(input: UpdateQuickPosProductSlotItemInput): Promise<Result<void>> {
    return localDataSource.updateSlotItem(normalizeUpdateInput(input));
  },
});
