import type { Result } from "@/shared/types/result.types";

export interface ExecuteDueScheduledTransfersUseCase {
  execute(profileId: string): Promise<Result<void>>;
}
