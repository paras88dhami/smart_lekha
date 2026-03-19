import type { HomeShortcutKey } from "../data/dataSource/homeShortcut.model";

export type HomeShortcut = {
  id: string;
  profileId: string;
  shortcutKey: HomeShortcutKey;
  sortOrder: number;
  isEnabled: boolean;
};

export type HomeShortcutSeed = {
  shortcutKey: HomeShortcutKey;
  sortOrder: number;
};
