import { translate } from "@/shared/i18n/resources";
import type { EditShortcutsError } from "../useCase/editShortcutsError";

const EDIT_SHORTCUTS_ERROR_KEY_MAP: Record<EditShortcutsError, string> = {
  no_active_profile: "editShortcuts.errors.noActiveProfile",
  load_failed: "editShortcuts.errors.loadFailed",
  minimum_one_shortcut: "editShortcuts.errors.minimumOneShortcut",
  save_failed: "editShortcuts.errors.saveFailed",
};

export const getEditShortcutsErrorMessage = (
  error: EditShortcutsError,
): string => {
  return translate(EDIT_SHORTCUTS_ERROR_KEY_MAP[error]);
};
