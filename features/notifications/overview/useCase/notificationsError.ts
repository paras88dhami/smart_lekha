export type NotificationsErrorCode = "no_active_profile" | "load_failed";

export class NotificationsError extends Error {
  readonly code: NotificationsErrorCode;

  constructor(code: NotificationsErrorCode) {
    super(code);
    this.code = code;
  }
}

export const createNotificationsError = (
  code: NotificationsErrorCode,
): NotificationsError => {
  return new NotificationsError(code);
};
