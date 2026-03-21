import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  QuickPosPaymentMode,
  QuickPosState,
} from "./quickPos.viewModel";

type StateSetter = Dispatch<SetStateAction<QuickPosState>>;

type Params = {
  setState: StateSetter;
};

export type QuickPosScreenStateController = {
  onSearchValueChange: (searchValue: string) => void;
  onPaymentModePress: (mode: QuickPosPaymentMode) => void;
  onReceivingAccountPress: (accountId: string) => void;
};

export const useQuickPosScreenStateController = ({
  setState,
}: Params): QuickPosScreenStateController => {
  const onSearchValueChange = useCallback((searchValue: string): void => {
    setState((currentState) => ({ ...currentState, searchValue }));
  }, [setState]);

  const onPaymentModePress = useCallback((mode: QuickPosPaymentMode): void => {
    setState((currentState) => ({
      ...currentState,
      paymentMode: mode,
      errorMessage: "",
    }));
  }, [setState]);

  const onReceivingAccountPress = useCallback((accountId: string): void => {
    setState((currentState) => ({
      ...currentState,
      selectedReceivingAccountId: accountId,
      errorMessage: "",
    }));
  }, [setState]);

  return {
    onSearchValueChange,
    onPaymentModePress,
    onReceivingAccountPress,
  };
};
