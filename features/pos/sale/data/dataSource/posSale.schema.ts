import { tableSchema } from "@nozbe/watermelondb";

export const posSaleTable = tableSchema({
  name: "pos_sales",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "account_id", type: "string", isOptional: true, isIndexed: true },
    { name: "sale_number", type: "string", isIndexed: true },
    { name: "line_items_json", type: "string" },
    { name: "total_amount", type: "number" },
    { name: "payment_mode", type: "string", isIndexed: true },
    { name: "status", type: "string", isIndexed: true },
    { name: "created_at", type: "number", isIndexed: true },
    { name: "updated_at", type: "number" },
  ],
});
