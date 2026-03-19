import type { Result } from "@/shared/types/result.types";
import type { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import type { BusinessCategoryDataSource } from "./businessCategory.dataSource";
import type { BusinessCategoryModel } from "./businessCategory.model";

const getCollection = (database: Database) => {
  return database.get<BusinessCategoryModel>("business_categories");
};

const mapUnknownError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error("Failed to load business categories.");
};

export const createLocalBusinessCategoryDataSource = (
  database: Database,
): BusinessCategoryDataSource => ({
  async getAllActiveBusinessCategories(): Promise<Result<BusinessCategoryModel[]>> {
    try {
      const records = await getCollection(database)
        .query(
          Q.where("is_active", true),
          Q.sortBy("sort_order", Q.asc),
          Q.sortBy("name", Q.asc),
        )
        .fetch();

      return {
        success: true,
        value: records,
      };
    } catch (error) {
      return {
        success: false,
        error: mapUnknownError(error),
      };
    }
  },
});
