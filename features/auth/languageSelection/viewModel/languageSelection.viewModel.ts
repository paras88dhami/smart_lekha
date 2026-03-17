import type {
  LanguageCodeType,
  LanguageSelectionState,
} from "../types/types";

export interface LanguageSelectionViewModel {
  state: LanguageSelectionState;
  loadSelectedLanguage(): Promise<void>;
  selectLanguage(languageCode: LanguageCodeType): void;
  continueToNextStep(): Promise<void>;
}
