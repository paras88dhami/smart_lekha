import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ResolveStartupDestinationUseCase } from "../useCase/resolveStartupDestination.useCase";
import type { StartupDestination, StartupGateViewModel } from "../types/types";

type Dependencies = {
  resolveStartupDestinationUseCase: ResolveStartupDestinationUseCase;
};

export const useStartupGateViewModel = (
  dependencies: Dependencies,
): StartupGateViewModel => {
  const [destination, setDestination] = useState<StartupDestination | null>(null);
  const isResolvingReference = useRef<boolean>(false);

  const resolveDestination = useCallback(async (): Promise<void> => {
    if (isResolvingReference.current) {
      return;
    }

    isResolvingReference.current = true;

    try {
      const nextDestination =
        await dependencies.resolveStartupDestinationUseCase.execute();

      setDestination(nextDestination);
    } finally {
      isResolvingReference.current = false;
    }
  }, [dependencies.resolveStartupDestinationUseCase]);

  useEffect((): void => {
    void resolveDestination();
  }, [resolveDestination]);

  return useMemo<StartupGateViewModel>(() => {
    return {
      state: { destination },
      onRetryPress: resolveDestination,
    };
  }, [destination, resolveDestination]);
};
