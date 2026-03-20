import { tableSchema } from "@nozbe/watermelondb";

export const quickPosCategorySlotTable = tableSchema({
  name: "quick_pos_category_slots",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "slot_order", type: "number", isIndexed: true },
    { name: "category_name", type: "string", isOptional: true, isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
