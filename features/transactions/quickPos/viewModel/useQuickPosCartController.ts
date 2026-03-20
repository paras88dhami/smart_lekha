import type { PosItem } from "@/features/pos/item/types/types";
import type { QuickPosError } from "../useCase/quickPosError";
import { buildQuickPosCartSnapshot } from "./quickPosCart.utils";
import type { QuickPosState } from "./quickPos.viewModel";
import { useCallback, useRef } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

type StateSetter = Dispatch<SetStateAction<QuickPosState>>;

type Params = {
  items: PosItem[];
  setState: StateSetter;
  applyFailureState: (error: QuickPosError) => void;
};

export type QuickPosCartController = {
  quantityByItemIdRef: MutableRefObject<Record<string, number>>;
  syncCartState: (items: PosItem[]) => void;
  resetQuantities: () => void;
  onIncreaseItemPress: (itemId: string) => void;
  onDecreaseItemPress: (itemId: string) => void;
  onClearCartPress: () => void;
};

export const useQuickPosCartController = ({
  items,
  setState,
  applyFailureState,
}: Params): QuickPosCartController => {
  const quantityByItemIdRef = useRef<Record<string, number>>({});

  const syncCartState = useCallback((itemsToSync: PosItem[]): void => {
    const cartSnapshot = buildQuickPosCartSnapshot(itemsToSync, quantityByItemIdRef.current);
    setState((currentState) => ({
      ...currentState,
      cart: cartSnapshot.cart,
      totalAmount: cartSnapshot.totalAmount,
    }));
  }, [setState]);

  const setQuantityForItem = useCallback((itemId: string, quantity: number): void => {
    quantityByItemIdRef.current = {
      ...quantityByItemIdRef.current,
      [itemId]: Math.max(0, quantity),
    };
    syncCartState(items);
  }, [items, syncCartState]);

  const onIncreaseItemPress = useCallback((itemId: string): void => {
    const selectedItem = items.find((item) => item.id === itemId);

    if (!selectedItem) {
      return;
    }

    const currentQuantity = quantityByItemIdRef.current[itemId] ?? 0;

    if (currentQuantity >= Math.max(0, selectedItem.availableStock)) {
      applyFailureState({ code: "insufficientStock", cause: null });
      return;
    }

    setQuantityForItem(itemId, currentQuantity + 1);
    setState((currentState) => ({ ...currentState, errorMessage: "" }));
  }, [applyFailureState, items, setQuantityForItem, setState]);

  const onDecreaseItemPress = useCallback((itemId: string): void => {
    const currentQuantity = quantityByItemIdRef.current[itemId] ?? 0;
    setQuantityForItem(itemId, currentQuantity - 1);
    setState((currentState) => ({ ...currentState, errorMessage: "" }));
  }, [setQuantityForItem, setState]);

  const resetQuantities = useCallback((): void => {
    quantityByItemIdRef.current = {};
  }, []);

  const onClearCartPress = useCallback((): void => {
    resetQuantities();
    setState((currentState) => ({
      ...currentState,
      cart: [],
      totalAmount: 0,
      errorMessage: "",
    }));
  }, [resetQuantities, setState]);

  return {
    quantityByItemIdRef,
    syncCartState,
    resetQuantities,
    onIncreaseItemPress,
    onDecreaseItemPress,
    onClearCartPress,
  };
};
