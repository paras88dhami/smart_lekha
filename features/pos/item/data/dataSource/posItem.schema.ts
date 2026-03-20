import { tableSchema } from "@nozbe/watermelondb";

export const posItemTable = tableSchema({
  name: "pos_items",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "item_name", type: "string", isIndexed: true },
    { name: "category_name", type: "string", isOptional: true, isIndexed: true },
    { name: "sku", type: "string", isOptional: true, isIndexed: true },
    { name: "unit_price", type: "number" },
    { name: "available_stock", type: "number" },
    { name: "is_active", type: "boolean", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
