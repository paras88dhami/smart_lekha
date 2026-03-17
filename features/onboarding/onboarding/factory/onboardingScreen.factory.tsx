import React from "react";
import OnboardingScreen from "@/features/onboarding/onboarding/ui/OnboardingScreen";
import { useOnboardingViewModel } from "@/features/onboarding/onboarding/viewModel/onboarding.viewModel.impl";
import { KhataDatabase } from "@/shared/database/khata.database";

type Params = { database: KhataDatabase; onFinished: () => void };
export function createOnboardingScreen(params: Params): React.ComponentType {
  return function OnboardingScreenFactory(): React.JSX.Element {
    const onFinished = React.useCallback(() => {
      params.onFinished();
    }, [params]);
    const viewModel = useOnboardingViewModel({
      database: params.database,
      onFinished,
    });
    return <OnboardingScreen viewModel={viewModel} />;
  };
}
