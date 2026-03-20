import type { Result } from "@/shared/types/result.types";
import type { GetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/getRecentPosSales.useCase";
import type { GetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase";
import type { GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { buildReportEntryTypeTotals, calculatePosSalesAmount } from "./reportsData.mapper";
import { createReportsError } from "./reportsError";
import type { LoadReportsOverviewUseCase } from "./loadReportsOverview.useCase";
import type { ReportsOverviewData } from "../types/types";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceSummaryUseCase: GetFinanceSummaryUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  getRecentPosSalesUseCase: GetRecentPosSalesUseCase;
  getSavedTransfersUseCase: GetSavedTransfersUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
};

const createFailure = (error: Error): Result<ReportsOverviewData> => {
  return { success: false, error };
};

export const createLoadReportsOverviewUseCase = (
  dependencies: Dependencies,
): LoadReportsOverviewUseCase => ({
  async execute(): Promise<Result<ReportsOverviewData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createReportsError("no_active_profile"));
    }

    const profileId = activeProfileResult.value.profileId;
    const [
      summaryResult,
      transactionsResult,
      posSalesResult,
      savedTransfersResult,
      scheduledTransfersResult,
    ] = await Promise.all([
      dependencies.getFinanceSummaryUseCase.execute(profileId),
      dependencies.getFinanceTransactionsUseCase.execute(profileId, 200),
      dependencies.getRecentPosSalesUseCase.execute(profileId, 100),
      dependencies.getSavedTransfersUseCase.execute(profileId, 100),
      dependencies.getScheduledTransfersUseCase.execute(profileId, 100),
    ]);

    if (
      !summaryResult.success ||
      !transactionsResult.success ||
      !posSalesResult.success ||
      !savedTransfersResult.success ||
      !scheduledTransfersResult.success
    ) {
      return createFailure(createReportsError("load_failed"));
    }

    return {
      success: true,
      value: {
        profileName: activeProfileResult.value.profileName,
        totalInflow: summaryResult.value.totalInflow,
        totalOutflow: summaryResult.value.totalOutflow,
        currentNet: summaryResult.value.currentNet,
        todayInflow: summaryResult.value.todayInflow,
        todayOutflow: summaryResult.value.todayOutflow,
        posSalesCount: posSalesResult.value.length,
        posSalesAmount: calculatePosSalesAmount(posSalesResult.value),
        savedTransfersCount: savedTransfersResult.value.length,
        scheduledTransfersCount: scheduledTransfersResult.value.length,
        entryTypeTotals: buildReportEntryTypeTotals(transactionsResult.value),
      },
    };
  },
});
