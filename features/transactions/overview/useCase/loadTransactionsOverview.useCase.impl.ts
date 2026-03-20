import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetOpenPaymentRecordsUseCase } from "@/features/transactions/paymentRecord/useCase/getOpenPaymentRecords.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { LoadTransactionsOverviewUseCase } from "./loadTransactionsOverview.useCase";
import { mapTransactionsOverviewData } from "./transactionsOverview.mapper";
import {
  createTransactionsFailure,
  type TransactionsResult,
} from "./transactionsError";
import type { TransactionsOverviewData } from "../types/types";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  getOpenPaymentRecordsUseCase: GetOpenPaymentRecordsUseCase;
};

export const createLoadTransactionsOverviewUseCase = (
  dependencies: Dependencies,
): LoadTransactionsOverviewUseCase => ({
  async execute(): Promise<TransactionsResult<TransactionsOverviewData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createTransactionsFailure("noActiveProfile");
    }

    const profileId = activeProfileResult.value.profileId;
    const ensureAccountsResult =
      await dependencies.ensureDefaultFinanceAccountsUseCase.execute(profileId);

    if (!ensureAccountsResult.success) {
      return createTransactionsFailure("loadFailed", ensureAccountsResult.error);
    }

    const transactionsResult =
      await dependencies.getFinanceTransactionsUseCase.execute(profileId, 50);

    if (!transactionsResult.success) {
      return createTransactionsFailure("loadFailed", transactionsResult.error);
    }

    const paymentRecordsResult =
      await dependencies.getOpenPaymentRecordsUseCase.execute(profileId);

    if (!paymentRecordsResult.success) {
      return createTransactionsFailure("loadFailed", paymentRecordsResult.error);
    }

    return {
      success: true,
      value: mapTransactionsOverviewData(
        transactionsResult.value,
        paymentRecordsResult.value,
      ),
    };
  },
});
