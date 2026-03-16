import React from "react";
import LanguageSelectionScreen from "@/features/auth/languageSelection/ui/LanguageSelectionScreen";
import { useLanguageSelectionViewModel } from "@/features/auth/languageSelection/viewModel/languageSelection.viewModel.impl";
import { KhataDatabase } from "@/shared/database/khata.database";

type Params = { database: KhataDatabase; onContinue: () => void };

export function createLanguageSelectionScreen(params: Params): React.ComponentType {
  return function LanguageSelectionScreenFactory(): React.JSX.Element {
    const onContinue = React.useCallback((): void => { params.onContinue(); }, [params]);
    const viewModel = useLanguageSelectionViewModel({ database: params.database, onContinue });
    return <LanguageSelectionScreen viewModel={viewModel} />;
  };
}
