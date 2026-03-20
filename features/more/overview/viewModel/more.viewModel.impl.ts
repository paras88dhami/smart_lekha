import { useCallback, useMemo, useRef, useState } from "react";
import type { LoadFeatureHubUseCase } from "../useCase/loadFeatureHub.useCase";
import type { LogoutFromFeatureHubUseCase } from "../useCase/logoutFromFeatureHub.useCase";
import { getMoreErrorMessage } from "./moreErrorMessage";
import {
  createFailureMoreState,
  createInitialMoreState,
  createLoadingMoreState,
  createSuccessMoreState,
} from "./moreState";
import type { MoreViewModel } from "./more.viewModel";

type Params = {
  loadFeatureHubUseCase: LoadFeatureHubUseCase;
  logoutFromFeatureHubUseCase: LogoutFromFeatureHubUseCase;
  onOpenFeature: (route: string) => void;
  onLoggedOut: () => void;
};

export const useMoreViewModel = (params: Params): MoreViewModel => {
  const { loadFeatureHubUseCase, logoutFromFeatureHubUseCase, onOpenFeature, onLoggedOut } =
    params;
  const featureHubData = useMemo(() => loadFeatureHubUseCase.execute(), [loadFeatureHubUseCase]);
  const isLoggingOutReference = useRef<boolean>(false);
  const [state, setState] = useState(() => createInitialMoreState(featureHubData));

  const onFeaturePress = useCallback(
    (featureId: string): void => {
      const feature = state.features.find((item) => item.id === featureId);
      if (!feature) {
        return;
      }

      onOpenFeature(feature.route);
    },
    [onOpenFeature, state.features],
  );

  const onLogoutPress = useCallback(async (): Promise<void> => {
    if (isLoggingOutReference.current) {
      return;
    }

    isLoggingOutReference.current = true;
    setState(createLoadingMoreState);

    try {
      const result = await logoutFromFeatureHubUseCase.execute();
      if (!result.success) {
        setState((currentState) =>
          createFailureMoreState(currentState, getMoreErrorMessage(result.error)),
        );
        return;
      }

      setState(createSuccessMoreState);
      onLoggedOut();
    } finally {
      isLoggingOutReference.current = false;
    }
  }, [logoutFromFeatureHubUseCase, onLoggedOut]);

  return useMemo<MoreViewModel>(() => {
    return { state, onFeaturePress, onLogoutPress };
  }, [onFeaturePress, onLogoutPress, state]);
};
