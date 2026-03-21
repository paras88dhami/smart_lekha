import { Status } from "@/shared/types/status.types";
import type { CheckoutQuickPosSaleUseCase } from "../useCase/checkoutQuickPosSale.useCase";
import type { QuickPosError } from "../useCase/quickPosError";
import type { QuickPosState } from "./quickPos.viewModel";
import { useCallback } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type StateSetter = Dispatch<SetStateAction<QuickPosState>>;

type Params = {
  state: QuickPosState;
  profileIdRef: MutableRefObject<string>;
  setState: StateSetter;
  applyFailureState: (error: QuickPosError) => void;
  resetQuantities: () => void;
  loadQuickPosScreen: () => Promise<void>;
  checkoutQuickPosSaleUseCase: CheckoutQuickPosSaleUseCase;
};

export type QuickPosCheckoutController = {
  onCheckoutPress: () => Promise<void>;
};

export const useQuickPosCheckoutController = ({
  state,
  profileIdRef,
  setState,
  applyFailureState,
  resetQuantities,
  loadQuickPosScreen,
  checkoutQuickPosSaleUseCase,
}: Params): QuickPosCheckoutController => {
  const onCheckoutPress = useCallback(async (): Promise<void> => {
    if (!profileIdRef.current) {
      applyFailureState({ code: "noActiveProfile", cause: null });
      return;
    }

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
      isCheckingOut: true,
    }));

    const checkoutResult = await checkoutQuickPosSaleUseCase.execute({
      profileId: profileIdRef.current,
      receivingAccountId: state.selectedReceivingAccountId,
      items: state.items,
      cart: state.cart,
      totalAmount: state.totalAmount,
      paymentMode: state.paymentMode,
    });

    if (!checkoutResult.success) {
      applyFailureState(checkoutResult.error);
      return;
    }

    resetQuantities();
    setState((currentState) => ({
      ...currentState,
      cart: [],
      totalAmount: 0,
      isCheckingOut: false,
      picker: { ...currentState.picker, isSaving: false },
    }));
    await loadQuickPosScreen();
  }, [
    applyFailureState,
    checkoutQuickPosSaleUseCase,
    loadQuickPosScreen,
    profileIdRef,
    resetQuantities,
    setState,
    state,
  ]);

  return { onCheckoutPress };
};
