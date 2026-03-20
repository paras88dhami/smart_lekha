import { Status } from "@/shared/types/status.types";
import type { ReportsOverviewData, ReportsState } from "../types/types";

export const createInitialReportsState = (): ReportsState => {
  return {
    status: Status.Idle,
    profileName: "",
    financialSummary: {
      totalInflow: 0,
      totalOutflow: 0,
      currentNet: 0,
      todayInflow: 0,
      todayOutflow: 0,
    },
    transferSummary: {
      savedTransfersCount: 0,
      scheduledTransfersCount: 0,
    },
    posSalesSummary: {
      posSalesCount: 0,
      posSalesAmount: 0,
    },
    entryTypeTotals: [],
    errorMessage: "",
  };
};

export const createLoadingReportsState = (state: ReportsState): ReportsState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createFailureReportsState = (
  state: ReportsState,
  errorMessage: string,
): ReportsState => {
  return { ...state, status: Status.Failure, errorMessage };
};

export const createSuccessReportsState = (
  state: ReportsState,
  data: ReportsOverviewData,
): ReportsState => {
  return { ...state, status: Status.Success, ...data, errorMessage: "" };
};
