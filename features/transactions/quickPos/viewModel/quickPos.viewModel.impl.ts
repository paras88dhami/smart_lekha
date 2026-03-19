import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { EnsureDefaultPosItemsUseCase } from "@/features/pos/item/useCase/types";
import type { GetPosItemsUseCase } from "@/features/pos/item/useCase/types";
import type { UpdatePosItemStockUseCase } from "@/features/pos/item/useCase/types";
import type { CreatePosSaleUseCase } from "@/features/pos/sale/useCase/types";
import type { QuickPosCartItem, QuickPosState, QuickPosViewModel } from "./quickPos.viewModel";

const generateSaleNumber = (): string => {
  return `POS-${Date.now()}`;
};

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  ensureDefaultPosItemsUseCase: EnsureDefaultPosItemsUseCase;
  getPosItemsUseCase: GetPosItemsUseCase;
  updatePosItemStockUseCase: UpdatePosItemStockUseCase;
  createPosSaleUseCase: CreatePosSaleUseCase;
};

const mapCartFromItems = (
  items: {
    id: string;
    itemName: string;
    unitPrice: number;
  }[],
  quantityMap: Record<string, number>,
): QuickPosCartItem[] => {
  return items
    .map((item) => {
      const quantity = quantityMap[item.id] ?? 0;

      if (quantity <= 0) {
        return null;
      }

      return {
        itemId: item.id,
        itemName: item.itemName,
        quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.unitPrice * quantity,
      };
    })
    .filter((item): item is QuickPosCartItem => Boolean(item));
};

export const useQuickPosViewModel = (params: Params): QuickPosViewModel => {
  const {
    getActiveProfileUseCase,
    ensureDefaultFinanceAccountsUseCase,
    getPrimaryFinanceAccountUseCase,
    adjustFinanceAccountBalanceUseCase,
    createFinanceTransactionUseCase,
    ensureDefaultPosItemsUseCase,
    getPosItemsUseCase,
    updatePosItemStockUseCase,
    createPosSaleUseCase,
  } = params;

  const isLoadingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [state, setState] = useState<QuickPosState>({
    status: Status.Idle,
    items: [],
    cart: [],
    paymentMode: "cash",
    totalAmount: 0,
    errorMessage: "",
  });

  const recalculateCart = useCallback(
    (items: QuickPosState["items"], currentQuantityMap: Record<string, number>): void => {
      const cart = mapCartFromItems(items, currentQuantityMap);
      const totalAmount = cart.reduce((sum, item) => sum + item.lineTotal, 0);

      setState((currentState) => ({
        ...currentState,
        cart,
        totalAmount,
      }));
    },
    [],
  );

  const loadPosData = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;
      const ensureAccountsResult = await ensureDefaultFinanceAccountsUseCase.execute(
        profileId,
      );

      if (!ensureAccountsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.loadFailed"),
        }));
        return;
      }

      const ensureItemsResult = await ensureDefaultPosItemsUseCase.execute(profileId);

      if (!ensureItemsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.loadFailed"),
        }));
        return;
      }

      const itemsResult = await getPosItemsUseCase.execute(profileId);

      if (!itemsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.loadFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        items: itemsResult.value,
        errorMessage: "",
      }));

      recalculateCart(itemsResult.value, quantityMap);
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    ensureDefaultFinanceAccountsUseCase,
    ensureDefaultPosItemsUseCase,
    getActiveProfileUseCase,
    getPosItemsUseCase,
    quantityMap,
    recalculateCart,
  ]);

  const onIncreaseItemPress = useCallback(
    (itemId: string): void => {
      setQuantityMap((currentMap) => {
        const nextMap = {
          ...currentMap,
          [itemId]: (currentMap[itemId] ?? 0) + 1,
        };

        recalculateCart(state.items, nextMap);
        return nextMap;
      });
    },
    [recalculateCart, state.items],
  );

  const onDecreaseItemPress = useCallback(
    (itemId: string): void => {
      setQuantityMap((currentMap) => {
        const currentQuantity = currentMap[itemId] ?? 0;
        const nextQuantity = Math.max(0, currentQuantity - 1);
        const nextMap = {
          ...currentMap,
          [itemId]: nextQuantity,
        };

        recalculateCart(state.items, nextMap);
        return nextMap;
      });
    },
    [recalculateCart, state.items],
  );

  const onPaymentModePress = useCallback((mode: "cash" | "bank"): void => {
    setState((currentState) => ({
      ...currentState,
      paymentMode: mode,
      errorMessage: "",
    }));
  }, []);

  const onCheckoutPress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    if (state.cart.length <= 0 || state.totalAmount <= 0) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("quickPos.errors.emptyCart"),
      }));
      return;
    }

    isSubmittingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;
      const accountResult = await getPrimaryFinanceAccountUseCase.execute(profileId);

      if (!accountResult.success || !accountResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.noPrimaryAccount"),
        }));
        return;
      }

      const saleNumber = generateSaleNumber();
      const createSaleResult = await createPosSaleUseCase.execute({
        profileId,
        accountId: accountResult.value.id,
        saleNumber,
        lineItems: state.cart,
        totalAmount: state.totalAmount,
        paymentMode: state.paymentMode,
        status: "success",
      });

      if (!createSaleResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.checkoutFailed"),
        }));
        return;
      }

      const createTransactionResult = await createFinanceTransactionUseCase.execute({
        profileId,
        accountId: accountResult.value.id,
        entryType: "pos_sale",
        categoryName: "POS Sale",
        counterpartyName: null,
        note: saleNumber,
        status: "success",
        amount: state.totalAmount,
        occurredAt: Date.now(),
        referenceId: createSaleResult.value.id,
      });

      if (!createTransactionResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.checkoutFailed"),
        }));
        return;
      }

      const balanceResult = await adjustFinanceAccountBalanceUseCase.execute({
        accountId: accountResult.value.id,
        deltaAmount: state.totalAmount,
      });

      if (!balanceResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("quickPos.errors.checkoutFailed"),
        }));
        return;
      }

      for (const lineItem of state.cart) {
        const updateStockResult = await updatePosItemStockUseCase.execute(
          lineItem.itemId,
          -lineItem.quantity,
        );

        if (!updateStockResult.success) {
          setState((currentState) => ({
            ...currentState,
            status: Status.Failure,
            errorMessage: translate("quickPos.errors.stockUpdateFailed"),
          }));
          return;
        }
      }

      setQuantityMap({});
      setState((currentState) => ({
        ...currentState,
        cart: [],
        totalAmount: 0,
      }));

      await loadPosData();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    adjustFinanceAccountBalanceUseCase,
    createFinanceTransactionUseCase,
    createPosSaleUseCase,
    getActiveProfileUseCase,
    getPrimaryFinanceAccountUseCase,
    loadPosData,
    state.cart,
    state.paymentMode,
    state.totalAmount,
    updatePosItemStockUseCase,
  ]);

  useEffect(() => {
    void loadPosData();
  }, [loadPosData]);

  return useMemo(() => {
    return {
      state,
      onRefreshPress: loadPosData,
      onIncreaseItemPress,
      onDecreaseItemPress,
      onPaymentModePress,
      onCheckoutPress,
    };
  }, [
    loadPosData,
    onCheckoutPress,
    onDecreaseItemPress,
    onIncreaseItemPress,
    onPaymentModePress,
    state,
  ]);
};
