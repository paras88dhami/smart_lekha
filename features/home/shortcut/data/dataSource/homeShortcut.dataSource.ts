import type { Result } from "@/shared/types/result.types";
import type { HomeShortcutSeed } from "../../types/types";
import type { HomeShortcutModel } from "./homeShortcut.model";

export type SaveHomeShortcutRecord = {
  id: string;
  sortOrder: number;
  isEnabled: boolean;
};

export interface HomeShortcutDataSource {
  getShortcutsByProfileId(profileId: string): Promise<Result<HomeShortcutModel[]>>;
  getAllShortcutsByProfileId(profileId: string): Promise<Result<HomeShortcutModel[]>>;
  createDefaultShortcuts(
    profileId: string,
    defaults: HomeShortcutSeed[],
  ): Promise<Result<void>>;
  saveShortcuts(
    profileId: string,
    shortcuts: SaveHomeShortcutRecord[],
  ): Promise<Result<void>>;
}
