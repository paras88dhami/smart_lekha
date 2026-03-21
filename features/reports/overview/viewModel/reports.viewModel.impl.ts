import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ReportsViewModel } from "./reports.viewModel";
import type { LoadReportsOverviewUseCase } from "../useCase/loadReportsOverview.useCase";
import { getReportsErrorMessage } from "./reportsErrorMessage";
import {
  createFailureReportsState,
  createInitialReportsState,
  createLoadingReportsState,
  createSuccessReportsState,
} from "./reportsState";

type Dependencies = {
  loadReportsOverviewUseCase: LoadReportsOverviewUseCase;
};

export const useReportsViewModel = (dependencies: Dependencies): ReportsViewModel => {
  const [state, setState] = useState(createInitialReportsState);
  const isLoadingReference = useRef<boolean>(false);

  const loadOverview = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingReportsState);

    try {
      const result = await dependencies.loadReportsOverviewUseCase.execute();
      if (!result.success) {
        setState((currentState) =>
          createFailureReportsState(currentState, getReportsErrorMessage(result.error)),
        );
        return;
      }

      setState((currentState) => createSuccessReportsState(currentState, result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadReportsOverviewUseCase]);

  useFocusEffect(
    useCallback(() => {
      void loadOverview();
    }, [loadOverview]),
  );

  return useMemo<ReportsViewModel>(() => {
    return { state, onRefreshPress: loadOverview };
  }, [loadOverview, state]);
};
