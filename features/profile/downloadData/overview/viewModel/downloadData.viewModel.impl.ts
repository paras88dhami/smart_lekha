import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DownloadDataViewModel } from "./downloadData.viewModel";
import type { GenerateDownloadDataSnapshotUseCase } from "../useCase/generateDownloadDataSnapshot.useCase";
import { getDownloadDataErrorMessage } from "./downloadDataErrorMessage";
import {
  createFailureDownloadDataState,
  createInitialDownloadDataState,
  createLoadingDownloadDataState,
  createSuccessDownloadDataState,
} from "./downloadDataState";

type Dependencies = {
  generateDownloadDataSnapshotUseCase: GenerateDownloadDataSnapshotUseCase;
};

export const useDownloadDataViewModel = (
  dependencies: Dependencies,
): DownloadDataViewModel => {
  const [state, setState] = useState(createInitialDownloadDataState);
  const isLoadingReference = useRef<boolean>(false);

  const generateSnapshot = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingDownloadDataState);

    try {
      const result = await dependencies.generateDownloadDataSnapshotUseCase.execute();
      if (!result.success) {
        setState((currentState) =>
          createFailureDownloadDataState(
            currentState,
            getDownloadDataErrorMessage(result.error),
          ),
        );
        return;
      }

      setState((currentState) => createSuccessDownloadDataState(currentState, result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.generateDownloadDataSnapshotUseCase]);

  useEffect((): void => {
    void generateSnapshot();
  }, [generateSnapshot]);

  return useMemo<DownloadDataViewModel>(() => {
    return {
      state,
      onRefreshPress: generateSnapshot,
      onGeneratePress: generateSnapshot,
    };
  }, [generateSnapshot, state]);
};
