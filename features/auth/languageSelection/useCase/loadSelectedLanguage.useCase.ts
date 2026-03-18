import { AuthResult } from "../../shared/authError.types";
import { LanguageCodeType } from "../types/types";

export interface LoadSelectedLanguageUseCase {
  execute(): Promise<AuthResult<LanguageCodeType>>;
}
