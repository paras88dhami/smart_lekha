import type { Result } from "@/shared/types/result.types";
import type { HomeShortcut } from "../types/types";

export interface SaveHomeShortcutsUseCase {
  execute(profileId: string, shortcuts: HomeShortcut[]): Promise<Result<void>>;
}
