import type { FeatureHubData } from "../types/types";

export interface LoadFeatureHubUseCase {
  execute(): FeatureHubData;
}
