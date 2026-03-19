import type { Result } from "@/shared/types/result.types";
import type { HomeShortcutSeed } from "../../types/types";
import type { HomeShortcutModel } from "./homeShortcut.model";

export interface HomeShortcutDataSource {
  getShortcutsByProfileId(profileId: string): Promise<Result<HomeShortcutModel[]>>;
  createDefaultShortcuts(
    profileId: string,
    defaults: HomeShortcutSeed[],
  ): Promise<Result<void>>;
}
