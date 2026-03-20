import type { AssignQuickPosProductSelectionUseCase } from "../useCase/assignQuickPosProductSelection.useCase";
import type { CreateQuickPosProductForSlotUseCase } from "../useCase/createQuickPosProductForSlot.useCase";
import type { QuickPosError } from "../useCase/quickPosError";
import { buildQuickPosProductRequest } from "./quickPosProductDraft.utils";
import {
  createClosedQuickPosPickerState,
  createEmptyQuickPosProductDraft,
} from "./quickPosState";
import type {
  QuickPosProductDraftField,
  QuickPosState,
} from "./quickPos.viewModel";
import { useCallback } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type StateSetter = Dispatch<SetStateAction<QuickPosState>>;

type Params = {
  pickerState: QuickPosState["picker"];
  profileIdRef: MutableRefObject<string>;
  setState: StateSetter;
  applyFailureState: (error: QuickPosError) => void;
  loadQuickPosScreen: () => Promise<void>;
  assignQuickPosProductSelectionUseCase: AssignQuickPosProductSelectionUseCase;
  createQuickPosProductForSlotUseCase: CreateQuickPosProductForSlotUseCase;
};

export type QuickPosPickerController = {
  onOpenProductPicker: (slotId: string) => void;
  onCloseProductPicker: () => void;
  onPickerSearchValueChange: (searchValue: string) => void;
  onProductDraftChange: (field: QuickPosProductDraftField, value: string) => void;
  onSelectProduct: (itemId: string) => Promise<void>;
  onCreateProductPress: () => Promise<void>;
  onClearProductSlot: (slotId: string) => Promise<void>;
};

export const useQuickPosPickerController = ({
  pickerState,
  profileIdRef,
  setState,
  applyFailureState,
  loadQuickPosScreen,
  assignQuickPosProductSelectionUseCase,
  createQuickPosProductForSlotUseCase,
}: Params): QuickPosPickerController => {
  const requireActiveProfileId = useCallback((): string | null => {
    if (!profileIdRef.current) {
      applyFailureState({ code: "noActiveProfile", cause: null });
      return null;
    }

    return profileIdRef.current;
  }, [applyFailureState, profileIdRef]);

  const onOpenProductPicker = useCallback((slotId: string): void => {
    setState((currentState) => ({
      ...currentState,
      errorMessage: "",
      picker: {
        isVisible: true,
        selectedSlotId: slotId,
        searchValue: "",
        draft: createEmptyQuickPosProductDraft(),
        isSaving: false,
      },
    }));
  }, [setState]);

  const onCloseProductPicker = useCallback((): void => {
    setState((currentState) => ({ ...currentState, picker: createClosedQuickPosPickerState() }));
  }, [setState]);

  const onPickerSearchValueChange = useCallback((searchValue: string): void => {
    setState((currentState) => ({
      ...currentState,
      picker: { ...currentState.picker, searchValue },
    }));
  }, [setState]);

  const onProductDraftChange = useCallback((field: QuickPosProductDraftField, value: string): void => {
    setState((currentState) => ({
      ...currentState,
      picker: {
        ...currentState.picker,
        draft: { ...currentState.picker.draft, [field]: value },
      },
    }));
  }, [setState]);

  const onSelectProduct = useCallback(async (itemId: string): Promise<void> => {
    const profileId = requireActiveProfileId();

    if (!profileId || !pickerState.selectedSlotId) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      picker: { ...currentState.picker, isSaving: true },
      errorMessage: "",
    }));

    const assignProductResult = await assignQuickPosProductSelectionUseCase.execute({
      profileId,
      slotId: pickerState.selectedSlotId,
      itemId,
    });

    if (!assignProductResult.success) {
      applyFailureState(assignProductResult.error);
      return;
    }

    setState((currentState) => ({ ...currentState, picker: createClosedQuickPosPickerState() }));
    await loadQuickPosScreen();
  }, [
    applyFailureState,
    assignQuickPosProductSelectionUseCase,
    loadQuickPosScreen,
    pickerState.selectedSlotId,
    requireActiveProfileId,
    setState,
  ]);

  const onCreateProductPress = useCallback(async (): Promise<void> => {
    const profileId = requireActiveProfileId();

    if (!profileId || !pickerState.selectedSlotId) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      picker: { ...currentState.picker, isSaving: true },
      errorMessage: "",
    }));

    const createProductResult = await createQuickPosProductForSlotUseCase.execute(
      buildQuickPosProductRequest(profileId, pickerState.selectedSlotId, pickerState.draft),
    );

    if (!createProductResult.success) {
      applyFailureState(createProductResult.error);
      return;
    }

    setState((currentState) => ({ ...currentState, picker: createClosedQuickPosPickerState() }));
    await loadQuickPosScreen();
  }, [
    applyFailureState,
    createQuickPosProductForSlotUseCase,
    loadQuickPosScreen,
    pickerState.draft,
    pickerState.selectedSlotId,
    requireActiveProfileId,
    setState,
  ]);

  const onClearProductSlot = useCallback(async (slotId: string): Promise<void> => {
    const profileId = requireActiveProfileId();

    if (!profileId) {
      return;
    }

    const clearSlotResult = await assignQuickPosProductSelectionUseCase.execute({
      profileId,
      slotId,
      itemId: null,
    });

    if (!clearSlotResult.success) {
      applyFailureState(clearSlotResult.error);
      return;
    }

    await loadQuickPosScreen();
  }, [
    applyFailureState,
    assignQuickPosProductSelectionUseCase,
    loadQuickPosScreen,
    requireActiveProfileId,
  ]);

  return {
    onOpenProductPicker,
    onCloseProductPicker,
    onPickerSearchValueChange,
    onProductDraftChange,
    onSelectProduct,
    onCreateProductPress,
    onClearProductSlot,
  };
};
