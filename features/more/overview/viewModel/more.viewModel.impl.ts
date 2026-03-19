import { getAuthErrorMessage } from "@/features/auth/shared/authErrorMessage";
import type { ClearAuthSessionUseCase } from "@/features/auth/session/useCase/clearAuthSession.useCase";
import { Status } from "@/shared/types/status.types";
import { useCallback, useRef, useState } from "react";
import type { MoreState, MoreViewModel } from "./more.viewModel";

type Params = {
  clearAuthSessionUseCase: ClearAuthSessionUseCase;
  onLoggedOut: () => void;
};

export const useMoreViewModel = (params: Params): MoreViewModel => {
  const { clearAuthSessionUseCase, onLoggedOut } = params;

  const isLoggingOutRef = useRef(false);
  const [state, setState] = useState<MoreState>({
    status: Status.Idle,
    errorMessage: "",
  });

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
    onLogoutPress,
  };
};
