import { tableSchema } from "@nozbe/watermelondb";

export const profileTable = tableSchema({
  name: "profiles",
  columns: [
    { name: "account_id", type: "string", isIndexed: true },
    { name: "profile_type", type: "string", isIndexed: true },
    { name: "profile_name", type: "string" },
    { name: "display_name", type: "string", isOptional: true },
    { name: "role_name", type: "string", isOptional: true },
    { name: "business_category_id", type: "string", isOptional: true, isIndexed: true },
    { name: "business_category_name", type: "string", isOptional: true },
    { name: "is_active", type: "boolean" },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
