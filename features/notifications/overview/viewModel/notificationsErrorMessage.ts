import { translate } from "@/shared/i18n/resources";
import { NotificationsError } from "../useCase/notificationsError";

export const getNotificationsErrorMessage = (error: Error): string => {
  if (!(error instanceof NotificationsError)) {
    return translate("notifications.errors.loadFailed");
  }

  switch (error.code) {
    case "no_active_profile":
      return translate("notifications.errors.noActiveProfile");
    case "load_failed":
    default:
      return translate("notifications.errors.loadFailed");
  }
};
