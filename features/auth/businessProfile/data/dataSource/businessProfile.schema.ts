import { tableSchema } from "@nozbe/watermelondb";

export const businessProfileTable = tableSchema({
  name: "business_profiles",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "business_name", type: "string" },
    { name: "business_category_id", type: "string", isOptional: true, isIndexed: true },
    { name: "business_category_name", type: "string", isOptional: true },
    { name: "country_iso", type: "string", isOptional: true, isIndexed: true },
    { name: "currency_code", type: "string", isOptional: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
