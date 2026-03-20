import type { StatusType } from "@/shared/types/status.types";

export type ReportEntryTypeTotalItem = {
  label: string;
  amount: number;
};

export type ReportFinancialSummary = {
  totalInflow: number;
  totalOutflow: number;
  currentNet: number;
  todayInflow: number;
  todayOutflow: number;
};

export type ReportTransferSummary = {
  savedTransfersCount: number;
  scheduledTransfersCount: number;
};

export type ReportPosSalesSummary = {
  posSalesCount: number;
  posSalesAmount: number;
};

export type ReportsOverviewData = {
  profileName: string;
  financialSummary: ReportFinancialSummary;
  transferSummary: ReportTransferSummary;
  posSalesSummary: ReportPosSalesSummary;
  entryTypeTotals: ReportEntryTypeTotalItem[];
};

export type ReportsState = {
  status: StatusType;
  profileName: string;
  financialSummary: ReportFinancialSummary;
  transferSummary: ReportTransferSummary;
  posSalesSummary: ReportPosSalesSummary;
  entryTypeTotals: ReportEntryTypeTotalItem[];
  errorMessage: string;
};

export interface ReportsViewModel {
  state: ReportsState;
  onRefreshPress(): Promise<void>;
}
