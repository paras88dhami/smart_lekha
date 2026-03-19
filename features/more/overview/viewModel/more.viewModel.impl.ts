import { getAuthErrorMessage } from "@/features/auth/shared/authErrorMessage";
import type { ClearAuthSessionUseCase } from "@/features/auth/session/useCase/clearAuthSession.useCase";
import { Status } from "@/shared/types/status.types";
import { useCallback, useRef, useState } from "react";
import type { MoreFeatureItem, MoreState, MoreViewModel } from "./more.viewModel";

type Params = {
  clearAuthSessionUseCase: ClearAuthSessionUseCase;
  features: MoreFeatureItem[];
  onOpenFeature: (route: string) => void;
  onLoggedOut: () => void;
};

export const useMoreViewModel = (params: Params): MoreViewModel => {
  const { clearAuthSessionUseCase, features, onOpenFeature, onLoggedOut } = params;

  const isLoggingOutRef = useRef(false);
  const [state, setState] = useState<MoreState>({
    status: Status.Idle,
    errorMessage: "",
    features,
  });

  const onFeaturePress = useCallback(
    (featureId: string): void => {
      const feature = state.features.find((item) => item.id === featureId);

      if (!feature || feature.status !== "implemented" || !feature.route) {
        return;
      }

      onOpenFeature(feature.route);
    },
    [onOpenFeature, state.features],
  );

  const onLogoutPress = useCallback(async (): Promise<void> => {
    if (isLoggingOutRef.current) {
      return;
    }

    isLoggingOutRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const result = await clearAuthSessionUseCase.execute();

      if (!result.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: getAuthErrorMessage(result.error),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        errorMessage: "",
      }));

      onLoggedOut();
    } finally {
      isLoggingOutRef.current = false;
    }
  }, [clearAuthSessionUseCase, onLoggedOut]);

  return {
    state,
    onFeaturePress,
    onLogoutPress,
  };
};
