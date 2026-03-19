import { HomeShortcutModel } from "../homeShortcut.model";
import { homeShortcutTable } from "../homeShortcut.schema";

export const homeShortcutDbConfig = {
  models: [HomeShortcutModel],
  tables: [homeShortcutTable],
};
