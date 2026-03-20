import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { PosItem, PosCartLine } from "@/features/pos/item/types/types";
import type { UpdatePosItemStockUseCase } from "@/features/pos/item/useCase/updatePosItemStock.useCase";
import type { CreatePosSaleUseCase } from "@/features/pos/sale/useCase/createPosSale.useCase";
import type { GetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase";
import type { CheckoutQuickPosSaleInput, CheckoutQuickPosSaleUseCase } from "./checkoutQuickPosSale.useCase";
import { createQuickPosFailure, type QuickPosResult } from "./quickPosError";

type Params = {
  getActiveAccountUseCase: GetActiveAccountUseCase;
  createPosSaleUseCase: CreatePosSaleUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
  updatePosItemStockUseCase: UpdatePosItemStockUseCase;
};

const generateSaleNumber = (): string => {
  return `POS-${Date.now()}`;
};

const hasInvalidCart = (cart: PosCartLine[], totalAmount: number): boolean => {
  return cart.length <= 0 || totalAmount <= 0;
};

const hasInsufficientStock = (items: PosItem[], cart: PosCartLine[]): boolean => {
  const itemById = new Map(items.map((item) => [item.id, item]));

  return cart.some((lineItem) => {
    const inventoryItem = itemById.get(lineItem.itemId);
    return !inventoryItem || inventoryItem.availableStock < lineItem.quantity;
  });
};

const updateInventoryStock = async (
  cart: PosCartLine[],
  updatePosItemStockUseCase: UpdatePosItemStockUseCase,
): Promise<QuickPosResult<void>> => {
  for (const lineItem of cart) {
    const updateStockResult = await updatePosItemStockUseCase.execute({
      itemId: lineItem.itemId,
      deltaQuantity: -lineItem.quantity,
    });

    if (!updateStockResult.success) {
      return createQuickPosFailure("stockUpdateFailed", updateStockResult.error);
    }
  }

  return {
    success: true,
    value: undefined,
  };
};

export const createCheckoutQuickPosSaleUseCase = ({
  getActiveAccountUseCase,
  createPosSaleUseCase,
  createFinanceTransactionUseCase,
  adjustFinanceAccountBalanceUseCase,
  updatePosItemStockUseCase,
}: Params): CheckoutQuickPosSaleUseCase => ({
  async execute(input: CheckoutQuickPosSaleInput): Promise<QuickPosResult<void>> {
    if (hasInvalidCart(input.cart, input.totalAmount)) {
      return createQuickPosFailure("emptyCart");
    }

    if (hasInsufficientStock(input.items, input.cart)) {
      return createQuickPosFailure("insufficientStock");
    }

    const accountResult = await getActiveAccountUseCase.execute();

    if (!accountResult.success || !accountResult.value) {
      return createQuickPosFailure("noPrimaryAccount");
    }

    const saleNumber = generateSaleNumber();
    const createSaleResult = await createPosSaleUseCase.execute({
      profileId: input.profileId,
      accountId: accountResult.value.id,
      saleNumber,
      lineItems: input.cart,
      totalAmount: input.totalAmount,
      paymentMode: input.paymentMode,
      status: "success",
    });

    if (!createSaleResult.success) {
      return createQuickPosFailure("checkoutFailed", createSaleResult.error);
    }

    const createTransactionResult = await createFinanceTransactionUseCase.execute({
      profileId: input.profileId,
      accountId: accountResult.value.id,
      entryType: "pos_sale",
      categoryName: "POS Sale",
      counterpartyName: null,
      note: saleNumber,
      status: "success",
      amount: input.totalAmount,
      occurredAt: Date.now(),
      referenceId: createSaleResult.value.id,
    });

    if (!createTransactionResult.success) {
      return createQuickPosFailure("checkoutFailed", createTransactionResult.error);
    }

    const balanceResult = await adjustFinanceAccountBalanceUseCase.execute({
      accountId: accountResult.value.id,
      deltaAmount: input.totalAmount,
    });

    if (!balanceResult.success) {
      return createQuickPosFailure("checkoutFailed", balanceResult.error);
    }

    return updateInventoryStock(input.cart, updatePosItemStockUseCase);
  },
});
