import type { HomeShortcut } from "@/features/home/shortcut/types/types";
import type { SaveHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/saveHomeShortcuts.useCase";
import type { Result } from "@/shared/types/result.types";
import type { SaveEditableHomeShortcut } from "../types/types";
import type { EditShortcutsError } from "./editShortcutsError";
import type { SaveEditShortcutsUseCase } from "./saveEditShortcuts.useCase";

type Params = {
  saveHomeShortcutsUseCase: SaveHomeShortcutsUseCase;
};

const createFailureResult = <T>(
  error: EditShortcutsError,
): Result<T, EditShortcutsError> => {
  return {
    success: false,
    error,
  };
};

const mapSaveShortcut = (shortcut: SaveEditableHomeShortcut): HomeShortcut => {
  return {
    id: shortcut.id,
    profileId: shortcut.profileId,
    shortcutKey: shortcut.shortcutKey,
    sortOrder: shortcut.sortOrder,
    isEnabled: shortcut.isEnabled,
  };
};

const hasEnabledShortcut = (shortcuts: SaveEditableHomeShortcut[]): boolean => {
  return shortcuts.some((shortcut: SaveEditableHomeShortcut): boolean => {
    return shortcut.isEnabled;
  });
};

export const createSaveEditShortcutsUseCase = (
  params: Params,
): SaveEditShortcutsUseCase => ({
  async execute(
    profileId: string,
    shortcuts: SaveEditableHomeShortcut[],
  ): Promise<Result<void, EditShortcutsError>> {
    if (!hasEnabledShortcut(shortcuts)) {
      return createFailureResult<void>("minimum_one_shortcut");
    }

    const saveResult = await params.saveHomeShortcutsUseCase.execute(
      profileId,
      shortcuts.map(mapSaveShortcut),
    );

    if (!saveResult.success) {
      return createFailureResult<void>("save_failed");
    }

    return {
      success: true,
      value: undefined,
    };
  },
});
