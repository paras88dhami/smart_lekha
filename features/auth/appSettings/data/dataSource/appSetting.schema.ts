import { tableSchema } from "@nozbe/watermelondb";

export const appSettingTable = tableSchema({
  name: "app_settings",
  columns: [
    { name: "selected_language", type: "string", isOptional: true },
    { name: "onboarding_completed", type: "boolean" },
    { name: "active_profile_id", type: "string", isOptional: true },
    { name: "active_account_id", type: "string", isOptional: true },
    { name: "last_selected_country_iso", type: "string", isOptional: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
