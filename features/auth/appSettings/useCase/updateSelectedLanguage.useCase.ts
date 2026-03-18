import { AuthResult } from "../../shared/authError.types";
import { UpdateSelectedLanguageInput } from "../types/types";

export interface UpdateSelectedLanguageUseCase {
  execute(input: UpdateSelectedLanguageInput): Promise<AuthResult<void>>;
}
