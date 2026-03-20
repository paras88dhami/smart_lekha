import type { FeatureHubData, FeatureHubItem } from "../types/types";
import type { LoadFeatureHubUseCase } from "./loadFeatureHub.useCase";

type Dependencies = {
  features: FeatureHubItem[];
};

const cloneFeatureHubItem = (feature: FeatureHubItem): FeatureHubItem => {
  return { ...feature };
};

export const createLoadFeatureHubUseCase = (
  dependencies: Dependencies,
): LoadFeatureHubUseCase => ({
  execute(): FeatureHubData {
    return {
      features: dependencies.features.map(cloneFeatureHubItem),
    };
  },
});
