import type {
  EditableHomeShortcut,
  SaveEditableHomeShortcut,
} from "../types/types";

const normalizeEditableShortcuts = (
  shortcuts: EditableHomeShortcut[],
): EditableHomeShortcut[] => {
  return shortcuts.map(
    (shortcut: EditableHomeShortcut, index: number): EditableHomeShortcut => {
      return {
        ...shortcut,
        sortOrder: index + 1,
      };
    },
  );
};

const createSwappedShortcuts = (
  shortcuts: EditableHomeShortcut[],
  fromIndex: number,
  toIndex: number,
): EditableHomeShortcut[] => {
  const nextShortcuts = [...shortcuts];
  const currentShortcut = nextShortcuts[fromIndex];
  nextShortcuts[fromIndex] = nextShortcuts[toIndex];
  nextShortcuts[toIndex] = currentShortcut;
  return normalizeEditableShortcuts(nextShortcuts);
};

export const toggleEditableShortcut = (
  shortcuts: EditableHomeShortcut[],
  shortcutId: string,
): EditableHomeShortcut[] => {
  return shortcuts.map((shortcut: EditableHomeShortcut): EditableHomeShortcut => {
    if (shortcut.id !== shortcutId) {
      return shortcut;
    }

    return {
      ...shortcut,
      isEnabled: !shortcut.isEnabled,
    };
  });
};

export const moveEditableShortcutUp = (
  shortcuts: EditableHomeShortcut[],
  shortcutId: string,
): EditableHomeShortcut[] => {
  const currentIndex = shortcuts.findIndex(
    (shortcut: EditableHomeShortcut): boolean => {
      return shortcut.id === shortcutId;
    },
  );

  if (currentIndex <= 0) {
    return shortcuts;
  }

  return createSwappedShortcuts(shortcuts, currentIndex, currentIndex - 1);
};

export const moveEditableShortcutDown = (
  shortcuts: EditableHomeShortcut[],
  shortcutId: string,
): EditableHomeShortcut[] => {
  const currentIndex = shortcuts.findIndex(
    (shortcut: EditableHomeShortcut): boolean => {
      return shortcut.id === shortcutId;
    },
  );

  if (currentIndex < 0 || currentIndex >= shortcuts.length - 1) {
    return shortcuts;
  }

  return createSwappedShortcuts(shortcuts, currentIndex, currentIndex + 1);
};

export const createSaveEditableShortcuts = (
  profileId: string,
  shortcuts: EditableHomeShortcut[],
): SaveEditableHomeShortcut[] => {
  return shortcuts.map((shortcut: EditableHomeShortcut): SaveEditableHomeShortcut => {
    return {
      id: shortcut.id,
      profileId,
      shortcutKey: shortcut.shortcutKey,
      sortOrder: shortcut.sortOrder,
      isEnabled: shortcut.isEnabled,
    };
  });
};
