import { tableSchema } from "@nozbe/watermelondb";

export const transferRecordTable = tableSchema({
  name: "transfer_records",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "beneficiary_id", type: "string", isIndexed: true },
    { name: "from_account_id", type: "string", isOptional: true, isIndexed: true },
    { name: "to_account_id", type: "string", isOptional: true, isIndexed: true },
    { name: "target_name", type: "string", isOptional: true },
    { name: "target_type", type: "string", isOptional: true, isIndexed: true },
    { name: "transfer_method", type: "string", isOptional: true, isIndexed: true },
    { name: "amount", type: "number" },
    { name: "note", type: "string", isOptional: true },
    { name: "record_type", type: "string", isIndexed: true },
    { name: "scheduled_for", type: "number", isOptional: true, isIndexed: true },
    { name: "status", type: "string", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
