import React from "react";
import { PhoneEntryViewModel } from "./phoneEntry.viewModel";

type Params = {
  initialPhoneNumber: string;
  onContinue: (phoneNumber: string) => void;
  onClose: () => void;
};
export function usePhoneEntryViewModel(params: Params): PhoneEntryViewModel {
  const [phoneNumber, setPhoneNumber] = React.useState(
    params.initialPhoneNumber,
  );
  const changePhoneNumber = React.useCallback((value: string) => {
    setPhoneNumber(value.replace(/\D/g, "").slice(0, 10));
  }, []);
  const continueFlow = React.useCallback(() => {
    params.onContinue(phoneNumber);
  }, [params, phoneNumber]);
  const closeFlow = React.useCallback(() => {
    params.onClose();
  }, [params]);
  return { phoneNumber, changePhoneNumber, continueFlow, closeFlow };
}
