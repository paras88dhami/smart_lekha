import type { StatusType } from "@/shared/types/status.types";

export type FeatureHubModule =
  | "auth"
  | "cashBank"
  | "home"
  | "notifications"
  | "parties"
  | "pos"
  | "profile"
  | "reports"
  | "transactions"
  | "transfers";

export type FeatureHubItem = {
  id: string;
  module: FeatureHubModule;
  title: string;
  description: string;
  route: string;
};

export type FeatureHubData = {
  features: FeatureHubItem[];
};

export type MoreState = {
  status: StatusType;
  errorMessage: string;
  isLoggingOut: boolean;
  features: FeatureHubItem[];
};

export interface MoreViewModel {
  state: MoreState;
  onFeaturePress(featureId: string): void;
  onLogoutPress(): Promise<void>;
}
