import { tableSchema } from "@nozbe/watermelondb";

export const authSessionTable = tableSchema({
  name: "auth_session",
  columns: [
    { name: "account_id", type: "string", isOptional: true },
    { name: "phone_number", type: "string" },
    { name: "country_code", type: "string" },
    { name: "country_iso", type: "string", isIndexed: true },
    { name: "is_verified", type: "boolean" },
    { name: "is_logged_in", type: "boolean" },
    { name: "access_token", type: "string", isOptional: true },
    { name: "refresh_token", type: "string", isOptional: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
