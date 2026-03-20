import { translate } from "@/shared/i18n/resources";
import type { HomeDashboardError } from "../useCase/homeDashboardError";

const HOME_DASHBOARD_ERROR_KEY_MAP: Record<HomeDashboardError, string> = {
  no_active_profile: "home.errors.noActiveProfile",
  accounts_load_failed: "home.errors.accountsLoadFailed",
  shortcuts_load_failed: "home.errors.shortcutsLoadFailed",
  dashboard_load_failed: "home.errors.dashboardLoadFailed",
};

export const getHomeDashboardErrorMessage = (
  error: HomeDashboardError,
): string => {
  return translate(HOME_DASHBOARD_ERROR_KEY_MAP[error]);
};
