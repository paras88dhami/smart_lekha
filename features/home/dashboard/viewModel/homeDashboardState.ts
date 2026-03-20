import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import type { HomeDashboardData } from "../types/types";
import type { HomeDashboardState } from "./homeDashboard.viewModel";

const getGreetingMessage = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return translate("home.greeting.morning");
  }

  if (hour < 17) {
    return translate("home.greeting.afternoon");
  }

  return translate("home.greeting.evening");
};

const createEmptyAccountOverview = (): HomeDashboardState["accountOverview"] => {
  return {
    accountName: translate("home.account.default"),
    accountNumber: "",
    currencyCode: "NPR",
    balance: 0,
  };
};

export const createInitialHomeDashboardState = (): HomeDashboardState => {
  return {
    status: Status.Idle,
    greeting: getGreetingMessage(),
    profileName: "",
    accountOverview: createEmptyAccountOverview(),
    flowSummary: {
      todayInflow: 0,
      todayOutflow: 0,
    },
    shortcuts: [],
    recentActivity: [],
    errorMessage: "",
  };
};

export const createLoadingHomeDashboardState = (
  currentState: HomeDashboardState,
): HomeDashboardState => {
  return {
    ...currentState,
    status: Status.Loading,
    greeting: getGreetingMessage(),
    errorMessage: "",
  };
};

export const createFailureHomeDashboardState = (
  currentState: HomeDashboardState,
  errorMessage: string,
): HomeDashboardState => {
  return {
    ...currentState,
    status: Status.Failure,
    greeting: getGreetingMessage(),
    errorMessage,
  };
};

export const createSuccessHomeDashboardState = (
  data: HomeDashboardData,
): HomeDashboardState => {
  return {
    status: Status.Success,
    greeting: getGreetingMessage(),
    profileName: data.profileName,
    accountOverview: {
      accountName: data.accountOverview.accountName || translate("home.account.default"),
      accountNumber: data.accountOverview.accountNumber,
      currencyCode: data.accountOverview.currencyCode,
      balance: data.accountOverview.balance,
    },
    flowSummary: data.flowSummary,
    shortcuts: data.shortcuts,
    recentActivity: data.recentActivity,
    errorMessage: "",
  };
};
