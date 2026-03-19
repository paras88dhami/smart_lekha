import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { BusinessCategoryRepository } from "../data/repository/businessCategory.repository";
import type { BusinessCategory } from "../types/types";
import type { GetActiveBusinessCategoriesUseCase } from "./getActiveBusinessCategories.useCase";

export const createGetActiveBusinessCategoriesUseCase = (
  repository: BusinessCategoryRepository,
): GetActiveBusinessCategoriesUseCase => ({
  async execute(): Promise<AuthResult<BusinessCategory[]>> {
    return repository.getAllActiveBusinessCategories();
  },
});
