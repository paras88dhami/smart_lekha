import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { GetAllHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getAllHomeShortcuts.useCase";
import type { SaveHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/saveHomeShortcuts.useCase";
import type { HomeShortcut } from "@/features/home/shortcut/types/types";
import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { EditShortcutsState, EditShortcutsViewModel, EditableHomeShortcutItem } from "./editShortcuts.viewModel";

const SHORTCUT_LABEL_KEYS: Record<HomeShortcutKey, string> = {
  my_profile: "home.shortcuts.myProfile",
  my_accounts: "home.shortcuts.myAccounts",
  statement: "home.shortcuts.statement",
  esewa: "home.shortcuts.esewa",
  quick_pos: "home.shortcuts.quickPos",
  send_money: "home.shortcuts.sendMoney",
};

const normalizeShortcuts = (
  shortcuts: EditableHomeShortcutItem[],
): EditableHomeShortcutItem[] => {
  return shortcuts.map((shortcut, index) => ({
    ...shortcut,
    sortOrder: index + 1,
  }));
};

const mapShortcut = (shortcut: HomeShortcut): EditableHomeShortcutItem => {
  return {
    id: shortcut.id,
    shortcutKey: shortcut.shortcutKey,
    labelKey: SHORTCUT_LABEL_KEYS[shortcut.shortcutKey],
    sortOrder: shortcut.sortOrder,
    isEnabled: shortcut.isEnabled,
  };
};

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getAllHomeShortcutsUseCase: GetAllHomeShortcutsUseCase;
  saveHomeShortcutsUseCase: SaveHomeShortcutsUseCase;
};

export const useEditShortcutsViewModel = (
  params: Params,
): EditShortcutsViewModel => {
  const {
    getActiveProfileUseCase,
    ensureDefaultHomeShortcutsUseCase,
    getAllHomeShortcutsUseCase,
    saveHomeShortcutsUseCase,
  } = params;

  const isLoadingRef = useRef(false);
  const isSavingRef = useRef(false);
  const activeProfileIdRef = useRef("");

  const [state, setState] = useState<EditShortcutsState>({
    status: Status.Idle,
    profileName: "",
    shortcuts: [],
    hasChanges: false,
    errorMessage: "",
  });

  const loadShortcuts = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("editShortcuts.errors.noActiveProfile"),
        }));
        return;
      }

      const profile = activeProfileResult.value;
      activeProfileIdRef.current = profile.profileId;

      const ensureResult = await ensureDefaultHomeShortcutsUseCase.execute(
        profile.profileId,
      );

      if (!ensureResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("editShortcuts.errors.loadFailed"),
        }));
        return;
      }

      const shortcutsResult = await getAllHomeShortcutsUseCase.execute(profile.profileId);

      if (!shortcutsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("editShortcuts.errors.loadFailed"),
        }));
        return;
      }

      const shortcuts = shortcutsResult.value
        .sort((leftItem, rightItem) => leftItem.sortOrder - rightItem.sortOrder)
        .map(mapShortcut);

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        profileName: profile.profileName,
        shortcuts,
        hasChanges: false,
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    ensureDefaultHomeShortcutsUseCase,
    getActiveProfileUseCase,
    getAllHomeShortcutsUseCase,
  ]);

  const onToggleShortcutPress = useCallback((shortcutId: string): void => {
    setState((currentState) => ({
      ...currentState,
      shortcuts: currentState.shortcuts.map((shortcut) => {
        if (shortcut.id !== shortcutId) {
          return shortcut;
        }

        return {
          ...shortcut,
          isEnabled: !shortcut.isEnabled,
        };
      }),
      hasChanges: true,
      errorMessage: "",
    }));
  }, []);

  const onMoveUpPress = useCallback((shortcutId: string): void => {
    setState((currentState) => {
      const index = currentState.shortcuts.findIndex((shortcut) => shortcut.id === shortcutId);

      if (index <= 0) {
        return currentState;
      }

      const nextShortcuts = [...currentState.shortcuts];
      const previousItem = nextShortcuts[index - 1];
      nextShortcuts[index - 1] = nextShortcuts[index];
      nextShortcuts[index] = previousItem;

      return {
        ...currentState,
        shortcuts: normalizeShortcuts(nextShortcuts),
        hasChanges: true,
        errorMessage: "",
      };
    });
  }, []);

  const onMoveDownPress = useCallback((shortcutId: string): void => {
    setState((currentState) => {
      const index = currentState.shortcuts.findIndex((shortcut) => shortcut.id === shortcutId);

      if (index < 0 || index >= currentState.shortcuts.length - 1) {
        return currentState;
      }

      const nextShortcuts = [...currentState.shortcuts];
      const nextItem = nextShortcuts[index + 1];
      nextShortcuts[index + 1] = nextShortcuts[index];
      nextShortcuts[index] = nextItem;

      return {
        ...currentState,
        shortcuts: normalizeShortcuts(nextShortcuts),
        hasChanges: true,
        errorMessage: "",
      };
    });
  }, []);

  const onSavePress = useCallback(async (): Promise<void> => {
    if (isSavingRef.current || !state.hasChanges) {
      return;
    }

    const profileId = activeProfileIdRef.current;

    if (!profileId) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("editShortcuts.errors.noActiveProfile"),
      }));
      return;
    }

    const enabledCount = state.shortcuts.filter((shortcut) => shortcut.isEnabled).length;

    if (enabledCount <= 0) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("editShortcuts.errors.minimumOneShortcut"),
      }));
      return;
    }

    isSavingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const payload: HomeShortcut[] = state.shortcuts.map((shortcut) => ({
        id: shortcut.id,
        profileId,
        shortcutKey: shortcut.shortcutKey,
        sortOrder: shortcut.sortOrder,
        isEnabled: shortcut.isEnabled,
      }));

      const saveResult = await saveHomeShortcutsUseCase.execute(profileId, payload);

      if (!saveResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("editShortcuts.errors.saveFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        hasChanges: false,
        errorMessage: "",
      }));
    } finally {
      isSavingRef.current = false;
    }
  }, [saveHomeShortcutsUseCase, state.hasChanges, state.shortcuts]);

  useEffect(() => {
    void loadShortcuts();
  }, [loadShortcuts]);

  return {
    state,
    onRefreshPress: loadShortcuts,
    onToggleShortcutPress,
    onMoveUpPress,
    onMoveDownPress,
    onSavePress,
  };
};
