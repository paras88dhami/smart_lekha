import type { Result } from "@/shared/types/result.types";
import type { ActiveProfile } from "../../types/types";

export interface ActiveProfileRepository {
  getActiveProfile(): Promise<Result<ActiveProfile | null>>;
}
