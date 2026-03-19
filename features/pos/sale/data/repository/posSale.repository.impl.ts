import type { PosCartLine } from "@/features/pos/item/types/types";
import type { Result } from "@/shared/types/result.types";
import type { CreatePosSaleInput, PosSale } from "../../types/types";
import type { PosSaleDataSource } from "../dataSource/posSale.dataSource";
import type { PosSaleModel } from "../dataSource/posSale.model";
import type { PosSaleRepository } from "./posSale.repository";

const parseLineItems = (value: string | undefined): PosCartLine[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (
          typeof item !== "object" ||
          item === null ||
          typeof item.itemId !== "string" ||
          typeof item.itemName !== "string" ||
          typeof item.quantity !== "number" ||
          typeof item.unitPrice !== "number" ||
          typeof item.lineTotal !== "number"
        ) {
          return null;
        }

        return {
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        } as PosCartLine;
      })
      .filter((item): item is PosCartLine => Boolean(item));
  } catch {
    return [];
  }
};

const mapSale = (record: PosSaleModel): PosSale => {
  return {
    id: record.id,
    profileId: record.profileId?.trim() ?? "",
    accountId: record.accountId?.trim() ?? null,
    saleNumber: record.saleNumber?.trim() ?? "",
    lineItems: parseLineItems(record.lineItemsJson),
    totalAmount: Math.max(0, record.totalAmount ?? 0),
    paymentMode: record.paymentMode ?? "cash",
    status: record.status ?? "success",
    createdAt: record.createdAt ?? Date.now(),
  };
};

const toPayload = (input: CreatePosSaleInput): PosSaleModel => {
  return {
    profileId: input.profileId.trim(),
    accountId: input.accountId?.trim() ?? null,
    saleNumber: input.saleNumber.trim(),
    lineItemsJson: JSON.stringify(input.lineItems),
    totalAmount: Math.max(0, input.totalAmount),
    paymentMode: input.paymentMode,
    status: input.status,
  } as PosSaleModel;
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createPosSaleRepository = (
  localDataSource: PosSaleDataSource,
): PosSaleRepository => ({
  async getRecentByProfileId(profileId: string, limit: number): Promise<Result<PosSale[]>> {
    const result = await localDataSource.getRecentByProfileId(profileId.trim(), limit);

    if (!result.success) {
      return createFailure<PosSale[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapSale),
    };
  },

  async createSale(input: CreatePosSaleInput): Promise<Result<PosSale>> {
    const result = await localDataSource.createSale(toPayload(input));

    if (!result.success) {
      return createFailure<PosSale>(result.error);
    }

    return {
      success: true,
      value: mapSale(result.value),
    };
  },
});
