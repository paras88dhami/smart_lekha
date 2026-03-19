import type { Result } from "@/shared/types/result.types";
import type { BusinessCategoryModel } from "./businessCategory.model";

export interface BusinessCategoryDataSource {
  getAllActiveBusinessCategories(): Promise<Result<BusinessCategoryModel[]>>;
}
