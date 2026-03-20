import type { StatusType } from "@/shared/types/status.types";
import type { EditableHomeShortcut } from "../types/types";

export type EditShortcutsState = {
  status: StatusType;
  profileName: string;
  shortcuts: EditableHomeShortcut[];
  hasChanges: boolean;
  errorMessage: string;
};

export interface EditShortcutsViewModel {
  state: EditShortcutsState;
  onRefreshPress(): Promise<void>;
  onToggleShortcutPress(shortcutId: string): void;
  onMoveUpPress(shortcutId: string): void;
  onMoveDownPress(shortcutId: string): void;
  onSavePress(): Promise<void>;
}
