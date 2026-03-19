import type { StatusType } from "@/shared/types/status.types";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  kind: "transaction" | "scheduled_transfer";
};

export type NotificationsState = {
  status: StatusType;
  notifications: NotificationItem[];
  errorMessage: string;
};

export interface NotificationsViewModel {
  state: NotificationsState;
  onRefreshPress(): Promise<void>;
}
