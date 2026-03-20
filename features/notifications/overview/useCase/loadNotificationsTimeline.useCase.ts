import type { Result } from "@/shared/types/result.types";
import type { NotificationsOverviewData } from "../types/types";

export interface LoadNotificationsTimelineUseCase {
  execute(): Promise<Result<NotificationsOverviewData>>;
}
