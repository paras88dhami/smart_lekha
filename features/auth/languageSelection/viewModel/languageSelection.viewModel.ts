import { LanguageItem } from "@/shared/database/khata.database";
export type LanguageSelectionViewModel = { languages: LanguageItem[]; selectedLanguageId: string; selectLanguage: (languageId: string) => void; continueFlow: () => void; };
