import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LoadHomeDashboardUseCase } from "../useCase/loadHomeDashboard.useCase";
import { getHomeDashboardErrorMessage } from "./homeDashboardErrorMessage";
import {
  createFailureHomeDashboardState,
  createInitialHomeDashboardState,
  createLoadingHomeDashboardState,
  createSuccessHomeDashboardState,
} from "./homeDashboardState";
import type { HomeDashboardViewModel } from "./homeDashboard.viewModel";

type Params = {
  loadHomeDashboardUseCase: LoadHomeDashboardUseCase;
  onMyProfilePress: () => void;
  onEditShortcutsPress: () => void;
  onMyAccountsPress: () => void;
  onStatementPress: () => void;
  onEsewaPress: () => void;
  onQuickPosPress: () => void;
  onSendMoneyPress: () => void;
  onViewAllTransactionsPress: () => void;
  onNotificationsPress: () => void;
};

type ShortcutActionMap = Record<HomeShortcutKey, () => void>;

export const useHomeDashboardViewModel = (params: Params): HomeDashboardViewModel => {
  const {
    loadHomeDashboardUseCase,
    onMyProfilePress,
    onEditShortcutsPress,
    onMyAccountsPress,
    onStatementPress,
    onEsewaPress,
    onQuickPosPress,
    onSendMoneyPress,
    onViewAllTransactionsPress,
    onNotificationsPress,
  } = params;
  const [state, setState] = useState(createInitialHomeDashboardState);
  const isLoadingReference = useRef<boolean>(false);

  const shortcutActionMap = useMemo<ShortcutActionMap>(() => {
    return {
      my_profile: onMyProfilePress,
      my_accounts: onMyAccountsPress,
      statement: onStatementPress,
      esewa: onEsewaPress,
      quick_pos: onQuickPosPress,
      send_money: onSendMoneyPress,
    };
  }, [
    onEsewaPress,
    onMyAccountsPress,
    onMyProfilePress,
    onQuickPosPress,
    onSendMoneyPress,
    onStatementPress,
  ]);

  const loadDashboard = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingHomeDashboardState);

    try {
      const result = await loadHomeDashboardUseCase.execute();

      if (!result.success) {
        const errorMessage = getHomeDashboardErrorMessage(result.error);
        setState((currentState) => createFailureHomeDashboardState(currentState, errorMessage));
        return;
      }

      setState(createSuccessHomeDashboardState(result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [loadHomeDashboardUseCase]);

  const onShortcutPress = useCallback(
    (shortcutKey: HomeShortcutKey): void => {
      shortcutActionMap[shortcutKey]();
    },
    [shortcutActionMap],
  );

  useEffect((): void => {
    void loadDashboard();
  }, [loadDashboard]);

  return useMemo<HomeDashboardViewModel>(() => {
    return {
      state,
      onRefreshPress: loadDashboard,
      onShortcutPress,
      onEditShortcutsPress,
      onViewAllTransactionsPress,
      onNotificationsPress,
      onProfilePress: onMyProfilePress,
    };
  }, [
    loadDashboard,
    onShortcutPress,
    onEditShortcutsPress,
    onMyProfilePress,
    onNotificationsPress,
    onViewAllTransactionsPress,
    state,
  ]);
};
