import type { StatusType } from "@/shared/types/status.types";

export type DownloadDataSummary = {
  accountsCount: number;
  transactionsCount: number;
  beneficiariesCount: number;
  savedTransfersCount: number;
  scheduledTransfersCount: number;
  posItemsCount: number;
  posSalesCount: number;
};

export type DownloadDataState = {
  status: StatusType;
  profileName: string;
  generatedAt: number | null;
  summary: DownloadDataSummary;
  jsonPreview: string;
  errorMessage: string;
};

export interface DownloadDataViewModel {
  state: DownloadDataState;
  onRefreshPress(): Promise<void>;
  onGeneratePress(): Promise<void>;
}
