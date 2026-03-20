import { translate } from "@/shared/i18n/resources";
import { ReportsError } from "../useCase/reportsError";

export const getReportsErrorMessage = (error: Error): string => {
  if (!(error instanceof ReportsError)) {
    return translate("reports.errors.loadFailed");
  }

  switch (error.code) {
    case "no_active_profile":
      return translate("reports.errors.noActiveProfile");
    case "load_failed":
    default:
      return translate("reports.errors.loadFailed");
  }
};
