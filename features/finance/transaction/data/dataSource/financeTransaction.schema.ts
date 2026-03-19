import { tableSchema } from "@nozbe/watermelondb";

export const financeTransactionTable = tableSchema({
  name: "finance_transactions",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "account_id", type: "string", isOptional: true, isIndexed: true },
    { name: "entry_type", type: "string", isIndexed: true },
    { name: "category_name", type: "string", isOptional: true },
    { name: "counterparty_name", type: "string", isOptional: true },
    { name: "note", type: "string", isOptional: true },
    { name: "status", type: "string", isIndexed: true },
    { name: "amount", type: "number" },
    { name: "occurred_at", type: "number", isIndexed: true },
    { name: "reference_id", type: "string", isOptional: true, isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
