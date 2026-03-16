import React from "react";
import { KhataDatabase } from "@/shared/database/khata.database";
import { LanguageSelectionViewModel } from "./languageSelection.viewModel";

type Params = { database: KhataDatabase; onContinue: () => void };
export function useLanguageSelectionViewModel(params: Params): LanguageSelectionViewModel {
  const [selectedLanguageId, setSelectedLanguageId] = React.useState("en");
  const selectLanguage = React.useCallback((languageId: string) => { setSelectedLanguageId(languageId); }, []);
  const continueFlow = React.useCallback(() => { params.onContinue(); }, [params]);
  return { languages: params.database.languages, selectedLanguageId, selectLanguage, continueFlow };
}
