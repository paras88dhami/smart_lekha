import type { StatusType } from "@/shared/types/status.types";

export type ReportEntryTypeTotalItem = {
  label: string;
  amount: number;
};

export type ReportsState = {
  status: StatusType;
  profileName: string;
  totalInflow: number;
  totalOutflow: number;
  currentNet: number;
  todayInflow: number;
  todayOutflow: number;
  posSalesCount: number;
  posSalesAmount: number;
  savedTransfersCount: number;
  scheduledTransfersCount: number;
  entryTypeTotals: ReportEntryTypeTotalItem[];
  errorMessage: string;
};

export interface ReportsViewModel {
  state: ReportsState;
  onRefreshPress(): Promise<void>;
}
