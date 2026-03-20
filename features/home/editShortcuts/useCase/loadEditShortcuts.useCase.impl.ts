import { getHomeShortcutMetadata } from "@/features/home/shortcut/config/homeShortcutCatalog";
import type { HomeShortcut } from "@/features/home/shortcut/types/types";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { GetAllHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getAllHomeShortcuts.useCase";
import type { ActiveProfile } from "@/features/workspace/activeProfile/types/types";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { Result } from "@/shared/types/result.types";
import type { EditableHomeShortcut, EditShortcutsData } from "../types/types";
import type { EditShortcutsError } from "./editShortcutsError";
import type { LoadEditShortcutsUseCase } from "./loadEditShortcuts.useCase";

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getAllHomeShortcutsUseCase: GetAllHomeShortcutsUseCase;
};

const createFailureResult = <T>(
  error: EditShortcutsError,
): Result<T, EditShortcutsError> => {
  return {
    success: false,
    error,
  };
};

const mapEditableHomeShortcut = (shortcut: HomeShortcut): EditableHomeShortcut => {
  const metadata = getHomeShortcutMetadata(shortcut.shortcutKey);

  return {
    id: shortcut.id,
    shortcutKey: shortcut.shortcutKey,
    labelKey: metadata.labelKey,
    sortOrder: shortcut.sortOrder,
    isEnabled: shortcut.isEnabled,
  };
};

const loadActiveProfile = async (
  getActiveProfileUseCase: GetActiveProfileUseCase,
): Promise<Result<ActiveProfile, EditShortcutsError>> => {
  const activeProfileResult = await getActiveProfileUseCase.execute();

  if (!activeProfileResult.success || !activeProfileResult.value) {
    return createFailureResult<ActiveProfile>("no_active_profile");
  }

  return {
    success: true,
    value: activeProfileResult.value,
  };
};

export const createLoadEditShortcutsUseCase = (
  params: Params,
): LoadEditShortcutsUseCase => ({
  async execute(): Promise<Result<EditShortcutsData, EditShortcutsError>> {
    const activeProfileResult = await loadActiveProfile(params.getActiveProfileUseCase);

    if (!activeProfileResult.success) {
      return activeProfileResult;
    }

    const ensureShortcutsResult = await params.ensureDefaultHomeShortcutsUseCase.execute(
      activeProfileResult.value.profileId,
    );

    if (!ensureShortcutsResult.success) {
      return createFailureResult<EditShortcutsData>("load_failed");
    }

    const shortcutsResult = await params.getAllHomeShortcutsUseCase.execute(
      activeProfileResult.value.profileId,
    );

    if (!shortcutsResult.success) {
      return createFailureResult<EditShortcutsData>("load_failed");
    }

    const shortcuts = [...shortcutsResult.value]
      .sort((leftShortcut: HomeShortcut, rightShortcut: HomeShortcut): number => {
        return leftShortcut.sortOrder - rightShortcut.sortOrder;
      })
      .map(mapEditableHomeShortcut);

    return {
      success: true,
      value: {
        profileId: activeProfileResult.value.profileId,
        profileName: activeProfileResult.value.profileName,
        shortcuts,
      },
    };
  },
});
