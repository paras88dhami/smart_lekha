import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";
import type { StatusType } from "@/shared/types/status.types";

export type EditableHomeShortcutItem = {
  id: string;
  shortcutKey: HomeShortcutKey;
  labelKey: string;
  sortOrder: number;
  isEnabled: boolean;
};

export type EditShortcutsState = {
  status: StatusType;
  profileName: string;
  shortcuts: EditableHomeShortcutItem[];
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
