import { BusinessCategoryModel } from "../businessCategory.model";
import { businessCategoryTable } from "../businessCategory.schema";

export const businessCategoryDbConfig = {
  models: [BusinessCategoryModel],
  tables: [businessCategoryTable],
};
