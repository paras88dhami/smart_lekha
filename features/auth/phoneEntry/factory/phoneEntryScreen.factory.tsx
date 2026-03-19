import React from "react";
import PhoneEntryScreen from "@/features/auth/phoneEntry/ui/PhoneEntryScreen";
import { usePhoneEntryViewModel } from "@/features/auth/phoneEntry/viewModel/phoneEntry.viewModel.impl";

type Params = {
  initialPhoneNumber: string;
  onContinue: (phoneNumber: string) => void;
  onClose: () => void;
};
export function createPhoneEntryScreen(params: Params): React.ComponentType {
  const { initialPhoneNumber, onContinue: onContinueParam, onClose: onCloseParam } =
    params;

  return function PhoneEntryScreenFactory(): React.JSX.Element {
    const onContinue = React.useCallback(
      (phoneNumber: string): void => {
        onContinueParam(phoneNumber);
      },
      [onContinueParam],
    );

    const onClose = React.useCallback((): void => {
      onCloseParam();
    }, [onCloseParam]);

    const viewModel = usePhoneEntryViewModel({
      initialPhoneNumber,
      onContinue,
      onClose,
    });

    return <PhoneEntryScreen viewModel={viewModel} />;
  };
}
