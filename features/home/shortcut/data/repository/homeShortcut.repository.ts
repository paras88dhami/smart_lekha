import type { Result } from "@/shared/types/result.types";
import type { HomeShortcut, HomeShortcutSeed } from "../../types/types";

export interface HomeShortcutRepository {
  getShortcutsByProfileId(profileId: string): Promise<Result<HomeShortcut[]>>;
  createDefaultShortcuts(
    profileId: string,
    defaults: HomeShortcutSeed[],
  ): Promise<Result<void>>;
}
