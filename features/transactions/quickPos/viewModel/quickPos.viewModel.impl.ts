import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AssignQuickPosProductSelectionUseCase } from "../useCase/assignQuickPosProductSelection.useCase";
import type { CheckoutQuickPosSaleUseCase } from "../useCase/checkoutQuickPosSale.useCase";
import type { CreateQuickPosProductForSlotUseCase } from "../useCase/createQuickPosProductForSlot.useCase";
import type { LoadQuickPosScreenUseCase } from "../useCase/loadQuickPosScreen.useCase";
import type { QuickPosError } from "../useCase/quickPosError";
import { getQuickPosErrorMessage } from "./quickPosErrorMessage";
import { createInitialQuickPosState } from "./quickPosState";
import type { QuickPosState, QuickPosViewModel } from "./quickPos.viewModel";
import { useQuickPosCartController } from "./useQuickPosCartController";
import { useQuickPosCheckoutController } from "./useQuickPosCheckoutController";
import { useQuickPosLoadController } from "./useQuickPosLoadController";
import { useQuickPosPickerController } from "./useQuickPosPickerController";
import { useQuickPosScreenStateController } from "./useQuickPosScreenStateController";

type Params = { loadQuickPosScreenUseCase: LoadQuickPosScreenUseCase; assignQuickPosProductSelectionUseCase: AssignQuickPosProductSelectionUseCase; createQuickPosProductForSlotUseCase: CreateQuickPosProductForSlotUseCase; checkoutQuickPosSaleUseCase: CheckoutQuickPosSaleUseCase; };

const createFailureState = (
  currentState: QuickPosState,
  error: QuickPosError,
): QuickPosState => ({
  ...currentState,
  status: Status.Failure,
  errorMessage: getQuickPosErrorMessage(error),
  isCheckingOut: false,
  picker: { ...currentState.picker, isSaving: false },
});

export const useQuickPosViewModel = ({
  loadQuickPosScreenUseCase,
  assignQuickPosProductSelectionUseCase,
  createQuickPosProductForSlotUseCase,
  checkoutQuickPosSaleUseCase,
}: Params): QuickPosViewModel => {
  const [state, setState] = useState<QuickPosState>(createInitialQuickPosState);
  const applyFailureState = useCallback((error: QuickPosError): void => {
    setState((currentState) => createFailureState(currentState, error));
  }, []);

  const {
    syncCartState,
    resetQuantities,
    onIncreaseItemPress,
    onDecreaseItemPress,
    onClearCartPress,
  } = useQuickPosCartController({
    items: state.items,
    setState,
    applyFailureState,
  });

  const { profileIdRef, loadQuickPosScreen } = useQuickPosLoadController({
    setState,
    loadQuickPosScreenUseCase,
    syncCartState,
    applyFailureState,
  });
  const { onSearchValueChange, onPaymentModePress, onReceivingAccountPress } =
    useQuickPosScreenStateController({ setState });

  const {
    onOpenProductPicker,
    onCloseProductPicker,
    onPickerSearchValueChange,
    onProductDraftChange,
    onSelectProduct,
    onCreateProductPress,
    onClearProductSlot,
  } = useQuickPosPickerController({
    pickerState: state.picker,
    profileIdRef,
    setState,
    applyFailureState,
    loadQuickPosScreen,
    assignQuickPosProductSelectionUseCase,
    createQuickPosProductForSlotUseCase,
  });

  const { onCheckoutPress } = useQuickPosCheckoutController({
    state,
    profileIdRef,
    setState,
    applyFailureState,
    resetQuantities,
    loadQuickPosScreen,
    checkoutQuickPosSaleUseCase,
  });

  useEffect(() => {
    void loadQuickPosScreen();
  }, [loadQuickPosScreen]);

  return useMemo(() => ({ state, onRefreshPress: loadQuickPosScreen, onSearchValueChange, onIncreaseItemPress, onDecreaseItemPress, onPaymentModePress, onReceivingAccountPress, onClearCartPress, onOpenProductPicker, onCloseProductPicker, onPickerSearchValueChange, onProductDraftChange, onSelectProduct, onCreateProductPress, onClearProductSlot, onCheckoutPress }), [
    loadQuickPosScreen,
    onSearchValueChange,
    onIncreaseItemPress,
    onDecreaseItemPress,
    onPaymentModePress,
    onReceivingAccountPress,
    onClearCartPress,
    onOpenProductPicker,
    onCloseProductPicker,
    onPickerSearchValueChange,
    onProductDraftChange,
    onSelectProduct,
    onCreateProductPress,
    onClearProductSlot,
    onCheckoutPress,
    state,
  ]);
};
