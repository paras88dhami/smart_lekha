import type { LanguageSelectionResult } from "../types/types";

export interface GetSelectedLanguageUseCase {
  execute(): Promise<LanguageSelectionResult>;
}
