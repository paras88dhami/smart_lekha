import type { Database } from "@nozbe/watermelondb";
import { createAppSettingUseCases } from "@/features/auth/appSettings/factory/createAppSettingUseCases";
import { createAdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase.impl";
import { createEnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase.impl";
import { createGetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase.impl";
import { createGetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase.impl";
import { createGetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase.impl";
import { createLocalFinanceAccountDataSource } from "@/features/finance/account/data/dataSource/localFinanceAccount.dataSource.impl";
import { createFinanceAccountRepository } from "@/features/finance/account/data/repository/financeAccount.repository.impl";
import { createCreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase.impl";
import { createLocalFinanceTransactionDataSource } from "@/features/finance/transaction/data/dataSource/localFinanceTransaction.dataSource.impl";
import { createFinanceTransactionRepository } from "@/features/finance/transaction/data/repository/financeTransaction.repository.impl";
import { createLocalPosItemDataSource } from "@/features/pos/item/data/dataSource/localPosItem.dataSource.impl";
import { createPosItemRepository } from "@/features/pos/item/data/repository/posItem.repository.impl";
import { createCreatePosItemUseCase } from "@/features/pos/item/useCase/createPosItem.useCase.impl";
import { createEnsureDefaultPosItemsUseCase } from "@/features/pos/item/useCase/ensureDefaultPosItems.useCase.impl";
import { createGetPosItemsUseCase } from "@/features/pos/item/useCase/getPosItems.useCase.impl";
import { createUpdatePosItemStockUseCase } from "@/features/pos/item/useCase/updatePosItemStock.useCase.impl";
import { createLocalPosSaleDataSource } from "@/features/pos/sale/data/dataSource/localPosSale.dataSource.impl";
import { createPosSaleRepository } from "@/features/pos/sale/data/repository/posSale.repository.impl";
import { createCreatePosSaleUseCase } from "@/features/pos/sale/useCase/createPosSale.useCase.impl";
import { createGetActiveAccountUseCase } from "@/features/workspace/activeAccount/useCase/getActiveAccount.useCase.impl";
import { createLocalActiveProfileDataSource } from "@/features/workspace/activeProfile/data/dataSource/localActiveProfile.dataSource.impl";
import { createActiveProfileRepository } from "@/features/workspace/activeProfile/data/repository/activeProfile.repository.impl";
import { createGetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase.impl";
import { createLocalQuickPosProductSlotDataSource } from "../slot/data/dataSource/localQuickPosProductSlot.dataSource.impl";
import { createQuickPosProductSlotRepository } from "../slot/data/repository/quickPosProductSlot.repository.impl";
import { createAssignQuickPosProductSlotUseCase } from "../slot/useCase/assignQuickPosProductSlot.useCase.impl";
import { createEnsureDefaultQuickPosProductSlotsUseCase } from "../slot/useCase/ensureDefaultQuickPosProductSlots.useCase.impl";
import { createGetQuickPosProductSlotsUseCase } from "../slot/useCase/getQuickPosProductSlots.useCase.impl";
import { createAssignQuickPosProductSelectionUseCase } from "../useCase/assignQuickPosProductSelection.useCase.impl";
import { createCheckoutQuickPosSaleUseCase } from "../useCase/checkoutQuickPosSale.useCase.impl";
import { createCreateQuickPosProductForSlotUseCase } from "../useCase/createQuickPosProductForSlot.useCase.impl";
import { createLoadQuickPosScreenUseCase } from "../useCase/loadQuickPosScreen.useCase.impl";

export type QuickPosDependencies = ReturnType<typeof createQuickPosDependencies>;

export const createQuickPosDependencies = (database: Database) => {
  const activeProfileRepository = createActiveProfileRepository(
    createLocalActiveProfileDataSource(database),
  );
  const financeAccountRepository = createFinanceAccountRepository(
    createLocalFinanceAccountDataSource(database),
  );
  const financeTransactionRepository = createFinanceTransactionRepository(
    createLocalFinanceTransactionDataSource(database),
  );
  const posItemRepository = createPosItemRepository(createLocalPosItemDataSource(database));
  const posSaleRepository = createPosSaleRepository(createLocalPosSaleDataSource(database));
  const productSlotRepository = createQuickPosProductSlotRepository(
    createLocalQuickPosProductSlotDataSource(database),
  );
  const getActiveProfileUseCase = createGetActiveProfileUseCase(activeProfileRepository);
  const appSettingUseCases = createAppSettingUseCases(database);
  const ensureDefaultFinanceAccountsUseCase = createEnsureDefaultFinanceAccountsUseCase(
    financeAccountRepository,
  );
  const getActiveAccountUseCase = createGetActiveAccountUseCase({
    getActiveProfileUseCase,
    getAppSettingUseCase: appSettingUseCases.getAppSettingUseCase,
    getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
      financeAccountRepository,
    ),
    getPrimaryFinanceAccountUseCase: createGetPrimaryFinanceAccountUseCase(
      financeAccountRepository,
    ),
    setActiveAccountIdUseCase: appSettingUseCases.setActiveAccountIdUseCase,
  });
  const adjustFinanceAccountBalanceUseCase = createAdjustFinanceAccountBalanceUseCase(
    financeAccountRepository,
  );
  const createFinanceTransactionUseCase = createCreateFinanceTransactionUseCase(
    financeTransactionRepository,
  );
  const ensureDefaultPosItemsUseCase = createEnsureDefaultPosItemsUseCase(posItemRepository);
  const getPosItemsUseCase = createGetPosItemsUseCase(posItemRepository);
  const createPosItemUseCase = createCreatePosItemUseCase(posItemRepository);
  const updatePosItemStockUseCase = createUpdatePosItemStockUseCase(posItemRepository);
  const createPosSaleUseCase = createCreatePosSaleUseCase(posSaleRepository);
  const ensureDefaultQuickPosProductSlotsUseCase =
    createEnsureDefaultQuickPosProductSlotsUseCase(productSlotRepository);
  const getQuickPosProductSlotsUseCase = createGetQuickPosProductSlotsUseCase(
    productSlotRepository,
  );
  const assignQuickPosProductSlotUseCase = createAssignQuickPosProductSlotUseCase(
    productSlotRepository,
  );
  const loadQuickPosScreenUseCase = createLoadQuickPosScreenUseCase({
    getActiveProfileUseCase,
    getActiveAccountUseCase,
    ensureDefaultFinanceAccountsUseCase,
    getFinanceAccountsByProfileUseCase: createGetFinanceAccountsByProfileUseCase(
      financeAccountRepository,
    ),
    ensureDefaultPosItemsUseCase,
    getPosItemsUseCase,
    ensureDefaultQuickPosProductSlotsUseCase,
    getQuickPosProductSlotsUseCase,
  });
  const assignQuickPosProductSelectionUseCase =
    createAssignQuickPosProductSelectionUseCase({
      getQuickPosProductSlotsUseCase,
      assignQuickPosProductSlotUseCase,
    });
  const createQuickPosProductForSlotUseCase = createCreateQuickPosProductForSlotUseCase({
    createPosItemUseCase,
    assignQuickPosProductSelectionUseCase,
  });
  const checkoutQuickPosSaleUseCase = createCheckoutQuickPosSaleUseCase({
    getFinanceAccountByIdUseCase: createGetFinanceAccountByIdUseCase(
      financeAccountRepository,
    ),
    createPosSaleUseCase,
    createFinanceTransactionUseCase,
    adjustFinanceAccountBalanceUseCase,
    updatePosItemStockUseCase,
  });

  return {
    loadQuickPosScreenUseCase,
    assignQuickPosProductSelectionUseCase,
    createQuickPosProductForSlotUseCase,
    checkoutQuickPosSaleUseCase,
  };
};
