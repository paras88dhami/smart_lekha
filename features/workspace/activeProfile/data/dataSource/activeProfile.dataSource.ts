import type { Result } from "@/shared/types/result.types";
import type { ActiveProfile } from "../../types/types";

export interface ActiveProfileDataSource {
  getActiveProfile(): Promise<Result<ActiveProfile | null>>;
}
