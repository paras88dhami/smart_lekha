import type { AuthResult } from "../../shared/authError.types";
import type { PersistSelectedLanguageInput } from "../types/types";

export interface PersistSelectedLanguageUseCase {
  execute(input: PersistSelectedLanguageInput): Promise<AuthResult<void>>;
}