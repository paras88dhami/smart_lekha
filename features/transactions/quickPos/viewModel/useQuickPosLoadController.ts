import { Status } from "@/shared/types/status.types";
import type { LoadQuickPosScreenUseCase } from "../useCase/loadQuickPosScreen.useCase";
import type { QuickPosError } from "../useCase/quickPosError";
import type { QuickPosState } from "./quickPos.viewModel";
import { useCallback, useRef } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type StateSetter = Dispatch<SetStateAction<QuickPosState>>;

type Params = {
  setState: StateSetter;
  loadQuickPosScreenUseCase: LoadQuickPosScreenUseCase;
  syncCartState: (items: QuickPosState["items"]) => void;
  applyFailureState: (error: QuickPosError) => void;
};

export type QuickPosLoadController = {
  profileIdRef: MutableRefObject<string>;
  loadQuickPosScreen: () => Promise<void>;
};

export const useQuickPosLoadController = ({
  setState,
  loadQuickPosScreenUseCase,
  syncCartState,
  applyFailureState,
}: Params): QuickPosLoadController => {
  const isLoadingRef = useRef(false);
  const profileIdRef = useRef("");

  const loadQuickPosScreen = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setState((currentState) => ({ ...currentState, status: Status.Loading, errorMessage: "" }));

    try {
      const loadQuickPosResult = await loadQuickPosScreenUseCase.execute();

      if (!loadQuickPosResult.success) {
        profileIdRef.current = "";
        applyFailureState(loadQuickPosResult.error);
        return;
      }

      profileIdRef.current = loadQuickPosResult.value.profileId;
      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        items: loadQuickPosResult.value.items,
        productSlots: loadQuickPosResult.value.productSlots,
        receivingAccounts: loadQuickPosResult.value.receivingAccounts,
        selectedReceivingAccountId:
          currentState.selectedReceivingAccountId &&
          loadQuickPosResult.value.receivingAccounts.some(
            (account) => account.id === currentState.selectedReceivingAccountId,
          )
            ? currentState.selectedReceivingAccountId
            : loadQuickPosResult.value.activeReceivingAccountId,
        errorMessage: "",
        isCheckingOut: false,
      }));
      syncCartState(loadQuickPosResult.value.items);
    } finally {
      isLoadingRef.current = false;
    }
  }, [applyFailureState, loadQuickPosScreenUseCase, setState, syncCartState]);

  return {
    profileIdRef,
    loadQuickPosScreen,
  };
};
