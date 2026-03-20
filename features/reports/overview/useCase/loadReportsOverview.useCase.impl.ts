import type { Result } from "@/shared/types/result.types";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createReportsError } from "./reportsError";
import type { LoadReportsOverviewUseCase } from "./loadReportsOverview.useCase";
import type { ReportsOverviewData } from "../types/types";
import type { LoadReportEntryTypeTotalsUseCase } from "./sections/loadReportEntryTypeTotals.useCase";
import type { LoadReportsFinancialSummaryUseCase } from "./sections/loadReportsFinancialSummary.useCase";
import type { LoadReportsPosSalesSummaryUseCase } from "./sections/loadReportsPosSalesSummary.useCase";
import type { LoadReportsTransferSummaryUseCase } from "./sections/loadReportsTransferSummary.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  loadReportsFinancialSummaryUseCase: LoadReportsFinancialSummaryUseCase;
  loadReportsTransferSummaryUseCase: LoadReportsTransferSummaryUseCase;
  loadReportsPosSalesSummaryUseCase: LoadReportsPosSalesSummaryUseCase;
  loadReportEntryTypeTotalsUseCase: LoadReportEntryTypeTotalsUseCase;
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
      financialSummaryResult,
      transferSummaryResult,
      posSalesSummaryResult,
      entryTypeTotalsResult,
    ] = await Promise.all([
      dependencies.loadReportsFinancialSummaryUseCase.execute(profileId),
      dependencies.loadReportsTransferSummaryUseCase.execute(profileId),
      dependencies.loadReportsPosSalesSummaryUseCase.execute(profileId),
      dependencies.loadReportEntryTypeTotalsUseCase.execute(profileId),
    ]);

    if (
      !financialSummaryResult.success ||
      !transferSummaryResult.success ||
      !posSalesSummaryResult.success ||
      !entryTypeTotalsResult.success
    ) {
      return createFailure(createReportsError("load_failed"));
    }

    return {
      success: true,
      value: {
        profileName: activeProfileResult.value.profileName,
        financialSummary: financialSummaryResult.value,
        transferSummary: transferSummaryResult.value,
        posSalesSummary: posSalesSummaryResult.value,
        entryTypeTotals: entryTypeTotalsResult.value,
      },
    };
  },
});
