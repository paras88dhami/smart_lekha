import { tableSchema } from "@nozbe/watermelondb";

export const financeAccountTable = tableSchema({
  name: "finance_accounts",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "account_name", type: "string" },
    { name: "account_number", type: "string", isOptional: true },
    { name: "account_type", type: "string", isIndexed: true },
    { name: "is_primary", type: "boolean", isIndexed: true },
    { name: "is_archived", type: "boolean", isIndexed: true },
    { name: "currency_code", type: "string" },
    { name: "current_balance", type: "number" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
