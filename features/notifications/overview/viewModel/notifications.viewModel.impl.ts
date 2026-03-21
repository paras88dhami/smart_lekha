import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import type { NotificationsViewModel } from "./notifications.viewModel";
import type { LoadNotificationsTimelineUseCase } from "../useCase/loadNotificationsTimeline.useCase";
import { getNotificationsErrorMessage } from "./notificationsErrorMessage";
import {
  createFailureNotificationsState,
  createInitialNotificationsState,
  createLoadingNotificationsState,
  createSuccessNotificationsState,
} from "./notificationsState";

type Dependencies = {
  loadNotificationsTimelineUseCase: LoadNotificationsTimelineUseCase;
};

export const useNotificationsViewModel = (
  dependencies: Dependencies,
): NotificationsViewModel => {
  const [state, setState] = useState(createInitialNotificationsState);
  const isLoadingReference = useRef<boolean>(false);

  const loadTimeline = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingNotificationsState);

    try {
      const result = await dependencies.loadNotificationsTimelineUseCase.execute();
      if (!result.success) {
        setState((currentState) =>
          createFailureNotificationsState(
            currentState,
            getNotificationsErrorMessage(result.error),
          ),
        );
        return;
      }

      setState((currentState) => createSuccessNotificationsState(currentState, result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadNotificationsTimelineUseCase]);

  useFocusEffect(
    useCallback(() => {
      void loadTimeline();
    }, [loadTimeline]),
  );

  return useMemo<NotificationsViewModel>(() => {
    return { state, onRefreshPress: loadTimeline };
  }, [loadTimeline, state]);
};
