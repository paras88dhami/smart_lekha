import { Status } from "@/shared/types/status.types";
import type { FeatureHubData, MoreState } from "../types/types";

export const createInitialMoreState = (featureHubData: FeatureHubData): MoreState => {
  return {
    status: Status.Success,
    errorMessage: "",
    isLoggingOut: false,
    features: featureHubData.features,
  };
};

export const createLoadingMoreState = (state: MoreState): MoreState => {
  return { ...state, status: Status.Loading, errorMessage: "", isLoggingOut: true };
};

export const createFailureMoreState = (
  state: MoreState,
  errorMessage: string,
): MoreState => {
  return {
    ...state,
    status: Status.Failure,
    errorMessage,
    isLoggingOut: false,
  };
};

export const createSuccessMoreState = (state: MoreState): MoreState => {
  return { ...state, status: Status.Success, errorMessage: "", isLoggingOut: false };
};
