import { tableSchema } from "@nozbe/watermelondb";

export const homeShortcutTable = tableSchema({
  name: "home_shortcuts",
  columns: [
    { name: "profile_id", type: "string", isIndexed: true },
    { name: "shortcut_key", type: "string", isIndexed: true },
    { name: "sort_order", type: "number" },
    { name: "is_enabled", type: "boolean", isIndexed: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
  ],
});
