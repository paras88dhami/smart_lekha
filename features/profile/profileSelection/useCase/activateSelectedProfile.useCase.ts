import type { Result } from "@/shared/types/result.types";

export interface ActivateSelectedProfileUseCase {
  execute(profileId: string): Promise<Result<void>>;
}
