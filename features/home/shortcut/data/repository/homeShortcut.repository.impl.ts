import type { Result } from "@/shared/types/result.types";
import type { HomeShortcut, HomeShortcutSeed } from "../../types/types";
import type { HomeShortcutModel } from "../dataSource/homeShortcut.model";
import type {
  HomeShortcutDataSource,
  SaveHomeShortcutRecord,
} from "../dataSource/homeShortcut.dataSource";
import type { HomeShortcutRepository } from "./homeShortcut.repository";

const mapShortcut = (record: HomeShortcutModel): HomeShortcut => {
  return {
    id: record.id,
    profileId: record.profileId.trim(),
    shortcutKey: record.shortcutKey,
    sortOrder: record.sortOrder,
    isEnabled: record.isEnabled,
  };
};

const mapShortcutToPersistenceRecord = (
  shortcut: HomeShortcut,
): SaveHomeShortcutRecord => {
  return {
    id: shortcut.id,
    sortOrder: shortcut.sortOrder,
    isEnabled: shortcut.isEnabled,
  };
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createHomeShortcutRepository = (
  localDataSource: HomeShortcutDataSource,
): HomeShortcutRepository => ({
  async getShortcutsByProfileId(profileId: string): Promise<Result<HomeShortcut[]>> {
    const result = await localDataSource.getShortcutsByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<HomeShortcut[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapShortcut),
    };
  },

  async getAllShortcutsByProfileId(
    profileId: string,
  ): Promise<Result<HomeShortcut[]>> {
    const result = await localDataSource.getAllShortcutsByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<HomeShortcut[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapShortcut),
    };
  },

  async createDefaultShortcuts(
    profileId: string,
    defaults: HomeShortcutSeed[],
  ): Promise<Result<void>> {
    return localDataSource.createDefaultShortcuts(profileId.trim(), defaults);
  },

  async saveShortcuts(
    profileId: string,
    shortcuts: HomeShortcut[],
  ): Promise<Result<void>> {
    return localDataSource.saveShortcuts(
      profileId.trim(),
      shortcuts.map(mapShortcutToPersistenceRecord),
    );
  },
});
