import type { Result } from "@/shared/types/result.types";
import type { GetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/getRecentPosSales.useCase";
import { calculatePosSalesAmount } from "../reportsData.mapper";
import { createReportsError } from "../reportsError";
import type { LoadReportsPosSalesSummaryUseCase } from "./loadReportsPosSalesSummary.useCase";
import type { ReportPosSalesSummary } from "../../types/types";

type Dependencies = {
  getRecentPosSalesUseCase: GetRecentPosSalesUseCase;
};

const createFailure = (error: Error): Result<ReportPosSalesSummary> => {
  return { success: false, error };
};

export const createLoadReportsPosSalesSummaryUseCase = (
  dependencies: Dependencies,
): LoadReportsPosSalesSummaryUseCase => ({
  async execute(profileId: string): Promise<Result<ReportPosSalesSummary>> {
    const result = await dependencies.getRecentPosSalesUseCase.execute(profileId, 100);
    if (!result.success) {
      return createFailure(createReportsError("load_failed"));
    }

    return {
      success: true,
      value: {
        posSalesCount: result.value.length,
        posSalesAmount: calculatePosSalesAmount(result.value),
      },
    };
  },
});
