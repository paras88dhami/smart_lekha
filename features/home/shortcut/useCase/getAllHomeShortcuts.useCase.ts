import type { Result } from "@/shared/types/result.types";
import type { HomeShortcut } from "../types/types";

export interface GetAllHomeShortcutsUseCase {
  execute(profileId: string): Promise<Result<HomeShortcut[]>>;
}
