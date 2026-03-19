import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemInput, PosItem } from "../../types/types";
import type { PosItemDataSource } from "../dataSource/posItem.dataSource";
import type { PosItemModel } from "../dataSource/posItem.model";
import type { PosItemRepository } from "./posItem.repository";

const mapItem = (record: PosItemModel): PosItem => ({
  id: record.id,
  profileId: record.profileId?.trim() ?? "",
  itemName: record.itemName?.trim() ?? "",
  sku: record.sku?.trim() ?? null,
  unitPrice: Math.max(0, record.unitPrice ?? 0),
  availableStock: Math.max(0, record.availableStock ?? 0),
  isActive: Boolean(record.isActive),
});

const toPayload = (input: CreatePosItemInput): PosItemModel => {
  return {
    profileId: input.profileId.trim(),
    itemName: input.itemName.trim(),
    sku: input.sku?.trim() ?? null,
    unitPrice: Math.max(0, input.unitPrice),
    availableStock: Math.max(0, input.availableStock),
    isActive: input.isActive,
  } as PosItemModel;
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createPosItemRepository = (
  localDataSource: PosItemDataSource,
): PosItemRepository => ({
  async getActiveItemsByProfileId(profileId: string): Promise<Result<PosItem[]>> {
    const result = await localDataSource.getActiveItemsByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<PosItem[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapItem),
    };
  },

  async createItem(input: CreatePosItemInput): Promise<Result<PosItem>> {
    const result = await localDataSource.createItem(toPayload(input));

    if (!result.success) {
      return createFailure<PosItem>(result.error);
    }

    return {
      success: true,
      value: mapItem(result.value),
    };
  },

  async updateStock(itemId: string, deltaQuantity: number): Promise<Result<void>> {
    return localDataSource.updateStock(itemId.trim(), deltaQuantity);
  },
});
