import type { Result } from "@/shared/types/result.types";
import type { SaveEditableHomeShortcut } from "../types/types";
import type { EditShortcutsError } from "./editShortcutsError";

export interface SaveEditShortcutsUseCase {
  execute(
    profileId: string,
    shortcuts: SaveEditableHomeShortcut[],
  ): Promise<Result<void, EditShortcutsError>>;
}
