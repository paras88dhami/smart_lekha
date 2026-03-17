import type { AuthResult, LanguageCodeType } from "../types/types";
export type UpdateSelectedLanguageInput = {
  languageCode: LanguageCodeType;
};

export interface UpdateSelectedLanguageUseCase {
  execute(input: UpdateSelectedLanguageInput): Promise<AuthResult<void>>;
}
