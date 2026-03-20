import { tableSchema } from "@nozbe/watermelondb";

export const paymentRecordTable = tableSchema({
  name: "payment_records",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "direction", type: "string", isIndexed: true },
    { name: "party_name", type: "string", isIndexed: true },
    { name: "note", type: "string", isOptional: true },
    { name: "total_amount", type: "number" },
    { name: "settled_amount", type: "number" },
    { name: "status", type: "string", isIndexed: true },
    { name: "settled_at", type: "number", isOptional: true, isIndexed: true },
    { name: "created_at", type: "number", isIndexed: true },
    { name: "updated_at", type: "number" },
  ],
});
