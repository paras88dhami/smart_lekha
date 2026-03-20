import type { StatusType } from "@/shared/types/status.types";

export type NotificationTimelineItem = {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  kind: "transaction" | "scheduled_transfer";
};

export type NotificationsOverviewData = {
  notifications: NotificationTimelineItem[];
};

export type NotificationsState = {
  status: StatusType;
  notifications: NotificationTimelineItem[];
  errorMessage: string;
};

export interface NotificationsViewModel {
  state: NotificationsState;
  onRefreshPress(): Promise<void>;
}
