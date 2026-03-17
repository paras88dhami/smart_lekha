import type {
  LanguageCodeType,
  LanguageSelectionState,
} from "../types/types";

export interface LanguageSelectionViewModel {
  state: LanguageSelectionState;
  handleLoadSelectedLanguage(): Promise<void>;
  onLanguagePress(languageCode: LanguageCodeType): void;
  onContinuePress(): Promise<void>;
}