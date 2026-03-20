import { Status } from "@/shared/types/status.types";
import type { NotificationsOverviewData, NotificationsState } from "../types/types";

export const createInitialNotificationsState = (): NotificationsState => {
  return { status: Status.Idle, notifications: [], errorMessage: "" };
};

export const createLoadingNotificationsState = (
  state: NotificationsState,
): NotificationsState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createFailureNotificationsState = (
  state: NotificationsState,
  errorMessage: string,
): NotificationsState => {
  return { ...state, status: Status.Failure, errorMessage };
};

export const createSuccessNotificationsState = (
  state: NotificationsState,
  data: NotificationsOverviewData,
): NotificationsState => {
  return { ...state, status: Status.Success, notifications: data.notifications, errorMessage: "" };
};
