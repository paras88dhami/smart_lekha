import { translate } from "@/shared/i18n/resources";
import { DownloadDataError } from "../useCase/downloadDataError";

export const getDownloadDataErrorMessage = (error: Error): string => {
  if (!(error instanceof DownloadDataError)) {
    return translate("profile.downloadData.errors.generateFailed");
  }

  switch (error.code) {
    case "no_active_profile":
      return translate("profile.downloadData.errors.noActiveProfile");
    case "generate_failed":
    default:
      return translate("profile.downloadData.errors.generateFailed");
  }
};
