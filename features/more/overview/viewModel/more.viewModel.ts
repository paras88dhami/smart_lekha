import type { StatusType } from "@/shared/types/status.types";

export type MoreFeatureStatus = "implemented" | "placeholder";

export type MoreFeatureItem = {
  id: string;
  module: string;
  title: string;
  description: string;
  status: MoreFeatureStatus;
  databaseConnected: boolean;
  route?: string;
};

export type MoreState = {
  status: StatusType;
  errorMessage: string;
  features: MoreFeatureItem[];
};

export interface MoreViewModel {
  state: MoreState;
  onFeaturePress(featureId: string): void;
  onLogoutPress(): Promise<void>;
}
