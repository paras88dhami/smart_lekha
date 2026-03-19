import type { StatusType } from "@/shared/types/status.types";

export type MoreState = {
  status: StatusType;
  errorMessage: string;
};

export interface MoreViewModel {
  state: MoreState;
  onLogoutPress(): Promise<void>;
}
