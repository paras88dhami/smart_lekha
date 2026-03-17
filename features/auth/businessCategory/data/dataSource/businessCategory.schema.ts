import { tableSchema } from "@nozbe/watermelondb";

export const businessCategoryTable = tableSchema({
  name: "business_categories",
  columns: [
    { name: "name", type: "string", isIndexed: true },
    { name: "parent_id", type: "string", isOptional: true, isIndexed: true },
    { name: "slug", type: "string", isIndexed: true },
    { name: "is_active", type: "boolean" },
    { name: "sort_order", type: "number" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
