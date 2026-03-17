import React from "react";
import PhoneEntryScreen from "@/features/auth/phoneEntry/ui/PhoneEntryScreen";
import { usePhoneEntryViewModel } from "@/features/auth/phoneEntry/viewModel/phoneEntry.viewModel.impl";

type Params = {
  initialPhoneNumber: string;
  onContinue: (phoneNumber: string) => void;
  onClose: () => void;
};
export function createPhoneEntryScreen(params: Params): React.ComponentType {
  return function PhoneEntryScreenFactory(): React.JSX.Element {
    const onContinue = React.useCallback(
      (phoneNumber: string): void => {
        params.onContinue(phoneNumber);
      },
      [params],
    );
    const onClose = React.useCallback((): void => {
      params.onClose();
    }, [params]);
    const viewModel = usePhoneEntryViewModel({
      initialPhoneNumber: params.initialPhoneNumber,
      onContinue,
      onClose,
    });
    return <PhoneEntryScreen viewModel={viewModel} />;
  };
}
