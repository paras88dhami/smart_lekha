import { tableSchema } from "@nozbe/watermelondb";

export const quickPosProductSlotTable = tableSchema({
  name: "quick_pos_product_slots",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "category_name", type: "string", isIndexed: true },
    { name: "slot_order", type: "number", isIndexed: true },
    { name: "item_id", type: "string", isOptional: true, isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
