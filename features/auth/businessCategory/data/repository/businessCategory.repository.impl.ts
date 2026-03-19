import {
  AuthDatabaseError,
  type AuthResult,
} from "@/features/auth/shared/authError.types";
import type { BusinessCategoryDataSource } from "../dataSource/businessCategory.dataSource";
import type { BusinessCategoryRepository } from "./businessCategory.repository";
import type { BusinessCategory } from "../../types/types";

const createFailureResult = <T>(): AuthResult<T> => {
  return {
    success: false,
    error: AuthDatabaseError,
  };
};

export const createBusinessCategoryRepository = (
  localDataSource: BusinessCategoryDataSource,
): BusinessCategoryRepository => ({
  async getAllActiveBusinessCategories(): Promise<AuthResult<BusinessCategory[]>> {
    const result = await localDataSource.getAllActiveBusinessCategories();

    if (!result.success) {
      return createFailureResult<BusinessCategory[]>();
    }

    const categories: BusinessCategory[] = result.value.map((record) => ({
      id: record.id,
      name: record.name ?? "",
      slug: record.slug ?? "",
      parentId: record.parentId ?? null,
      sortOrder: record.sortOrder ?? 0,
    }));

    return {
      success: true,
      value: categories,
    };
  },
});
