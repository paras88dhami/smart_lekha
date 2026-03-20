import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LoadEditShortcutsUseCase } from "../useCase/loadEditShortcuts.useCase";
import type { SaveEditShortcutsUseCase } from "../useCase/saveEditShortcuts.useCase";
import { getEditShortcutsErrorMessage } from "./editShortcutsErrorMessage";
import {
  createSaveEditableShortcuts,
  moveEditableShortcutDown,
  moveEditableShortcutUp,
  toggleEditableShortcut,
} from "./editShortcutsDraft.utils";
import {
  createChangedEditShortcutsState,
  createFailureEditShortcutsState,
  createInitialEditShortcutsState,
  createLoadedEditShortcutsState,
  createLoadingEditShortcutsState,
  createSavedEditShortcutsState,
} from "./editShortcutsState";
import type { EditShortcutsViewModel } from "./editShortcuts.viewModel";

type Params = {
  loadEditShortcutsUseCase: LoadEditShortcutsUseCase;
  saveEditShortcutsUseCase: SaveEditShortcutsUseCase;
};

export const useEditShortcutsViewModel = (params: Params): EditShortcutsViewModel => {
  const [state, setState] = useState(createInitialEditShortcutsState);
  const activeProfileIdReference = useRef<string>("");
  const isLoadingReference = useRef<boolean>(false);
  const isSavingReference = useRef<boolean>(false);
  const loadShortcuts = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }
    isLoadingReference.current = true;
    setState(createLoadingEditShortcutsState);
    try {
      const result = await params.loadEditShortcutsUseCase.execute();
      if (!result.success) {
        const errorMessage = getEditShortcutsErrorMessage(result.error);
        setState((currentState) => createFailureEditShortcutsState(currentState, errorMessage));
        return;
      }
      activeProfileIdReference.current = result.value.profileId;
      setState(createLoadedEditShortcutsState(result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [params.loadEditShortcutsUseCase]);
  const onToggleShortcutPress = useCallback((shortcutId: string): void => {
    setState((currentState) => {
      const nextShortcuts = toggleEditableShortcut(currentState.shortcuts, shortcutId);
      return createChangedEditShortcutsState(currentState, nextShortcuts);
    });
  }, []);

  const onMoveUpPress = useCallback((shortcutId: string): void => {
    setState((currentState) => {
      const nextShortcuts = moveEditableShortcutUp(currentState.shortcuts, shortcutId);
      return createChangedEditShortcutsState(currentState, nextShortcuts);
    });
  }, []);

  const onMoveDownPress = useCallback((shortcutId: string): void => {
    setState((currentState) => {
      const nextShortcuts = moveEditableShortcutDown(currentState.shortcuts, shortcutId);
      return createChangedEditShortcutsState(currentState, nextShortcuts);
    });
  }, []);
  const onSavePress = useCallback(async (): Promise<void> => {
    if (isSavingReference.current || !state.hasChanges) {
      return;
    }
    if (!activeProfileIdReference.current) {
      const errorMessage = getEditShortcutsErrorMessage("no_active_profile");
      setState((currentState) => createFailureEditShortcutsState(currentState, errorMessage));
      return;
    }
    isSavingReference.current = true;
    setState(createLoadingEditShortcutsState);
    try {
      const savePayload = createSaveEditableShortcuts(
        activeProfileIdReference.current,
        state.shortcuts,
      );
      const result = await params.saveEditShortcutsUseCase.execute(
        activeProfileIdReference.current,
        savePayload,
      );

      if (!result.success) {
        const errorMessage = getEditShortcutsErrorMessage(result.error);
        setState((currentState) => createFailureEditShortcutsState(currentState, errorMessage));
        return;
      }
      setState(createSavedEditShortcutsState);
    } finally {
      isSavingReference.current = false;
    }
  }, [params.saveEditShortcutsUseCase, state.hasChanges, state.shortcuts]);
  useEffect((): void => {
    void loadShortcuts();
  }, [loadShortcuts]);
  return useMemo<EditShortcutsViewModel>(() => {
    return {
      state,
      onRefreshPress: loadShortcuts,
      onToggleShortcutPress,
      onMoveUpPress,
      onMoveDownPress,
      onSavePress,
    };
  }, [
    loadShortcuts,
    onMoveDownPress,
    onMoveUpPress,
    onSavePress,
    onToggleShortcutPress,
    state,
  ]);
};
