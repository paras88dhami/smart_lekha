import type { Result } from "@/shared/types/result.types";
import type { HomeDashboardData } from "../types/types";
import type { HomeDashboardError } from "./homeDashboardError";

export interface LoadHomeDashboardUseCase {
  execute(): Promise<Result<HomeDashboardData, HomeDashboardError>>;
}
