import { Status } from "@/shared/types/status.types";
import type { EditShortcutsData, EditableHomeShortcut } from "../types/types";
import type { EditShortcutsState } from "./editShortcuts.viewModel";

export const createInitialEditShortcutsState = (): EditShortcutsState => {
  return {
    status: Status.Idle,
    profileName: "",
    shortcuts: [],
    hasChanges: false,
    errorMessage: "",
  };
};

export const createLoadingEditShortcutsState = (
  currentState: EditShortcutsState,
): EditShortcutsState => {
  return {
    ...currentState,
    status: Status.Loading,
    errorMessage: "",
  };
};

export const createFailureEditShortcutsState = (
  currentState: EditShortcutsState,
  errorMessage: string,
): EditShortcutsState => {
  return {
    ...currentState,
    status: Status.Failure,
    errorMessage,
  };
};

export const createLoadedEditShortcutsState = (
  data: EditShortcutsData,
): EditShortcutsState => {
  return {
    status: Status.Success,
    profileName: data.profileName,
    shortcuts: data.shortcuts,
    hasChanges: false,
    errorMessage: "",
  };
};

export const createChangedEditShortcutsState = (
  currentState: EditShortcutsState,
  shortcuts: EditableHomeShortcut[],
): EditShortcutsState => {
  return {
    ...currentState,
    shortcuts,
    hasChanges: true,
    errorMessage: "",
  };
};

export const createSavedEditShortcutsState = (
  currentState: EditShortcutsState,
): EditShortcutsState => {
  return {
    ...currentState,
    status: Status.Success,
    hasChanges: false,
    errorMessage: "",
  };
};
