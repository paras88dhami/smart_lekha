import type { Result } from "@/shared/types/result.types";
import type { ActiveProfile } from "../types/types";

export interface GetActiveProfileUseCase {
  execute(): Promise<Result<ActiveProfile | null>>;
}
