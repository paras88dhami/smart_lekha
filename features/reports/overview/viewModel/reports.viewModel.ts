import { ReportsState } from "../types/types";

export interface ReportsViewModel {
  state: ReportsState;
  onRefreshPress(): Promise<void>;
}