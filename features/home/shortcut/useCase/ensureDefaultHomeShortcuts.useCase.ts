import type { Result } from "@/shared/types/result.types";

export interface EnsureDefaultHomeShortcutsUseCase {
  execute(profileId: string): Promise<Result<void>>;
}
