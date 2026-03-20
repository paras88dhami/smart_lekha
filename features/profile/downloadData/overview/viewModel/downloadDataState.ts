import { Status } from "@/shared/types/status.types";
import type { DownloadDataSnapshot, DownloadDataState } from "../types/types";

export const createInitialDownloadDataState = (): DownloadDataState => {
  return {
    status: Status.Idle,
    profileName: "",
    generatedAt: null,
    summary: {
      accountsCount: 0,
      transactionsCount: 0,
      beneficiariesCount: 0,
      savedTransfersCount: 0,
      scheduledTransfersCount: 0,
      posItemsCount: 0,
      posSalesCount: 0,
    },
    jsonPreview: "",
    errorMessage: "",
  };
};

export const createLoadingDownloadDataState = (
  state: DownloadDataState,
): DownloadDataState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createFailureDownloadDataState = (
  state: DownloadDataState,
  errorMessage: string,
): DownloadDataState => {
  return { ...state, status: Status.Failure, errorMessage };
};

export const createSuccessDownloadDataState = (
  state: DownloadDataState,
  snapshot: DownloadDataSnapshot,
): DownloadDataState => {
  return {
    ...state,
    status: Status.Success,
    profileName: snapshot.profileName,
    generatedAt: snapshot.generatedAt,
    summary: snapshot.summary,
    jsonPreview: snapshot.jsonPreview,
    errorMessage: "",
  };
};
