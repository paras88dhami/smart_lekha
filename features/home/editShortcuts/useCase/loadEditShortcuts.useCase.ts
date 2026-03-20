import type { Result } from "@/shared/types/result.types";
import type { EditShortcutsData } from "../types/types";
import type { EditShortcutsError } from "./editShortcutsError";

export interface LoadEditShortcutsUseCase {
  execute(): Promise<Result<EditShortcutsData, EditShortcutsError>>;
}
