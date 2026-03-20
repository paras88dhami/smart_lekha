import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";

export type EditableHomeShortcut = {
  id: string;
  shortcutKey: HomeShortcutKey;
  labelKey: string;
  sortOrder: number;
  isEnabled: boolean;
};

export type EditShortcutsData = {
  profileId: string;
  profileName: string;
  shortcuts: EditableHomeShortcut[];
};

export type SaveEditableHomeShortcut = {
  id: string;
  profileId: string;
  shortcutKey: HomeShortcutKey;
  sortOrder: number;
  isEnabled: boolean;
};
