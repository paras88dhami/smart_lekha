import type { Result } from "@/shared/types/result.types";
import type { GetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase";
import { createReportsError } from "../reportsError";
import type { LoadReportsFinancialSummaryUseCase } from "./loadReportsFinancialSummary.useCase";
import type { ReportFinancialSummary } from "../../types/types";

type Dependencies = {
  getFinanceSummaryUseCase: GetFinanceSummaryUseCase;
};

const createFailure = (error: Error): Result<ReportFinancialSummary> => {
  return { success: false, error };
};

export const createLoadReportsFinancialSummaryUseCase = (
  dependencies: Dependencies,
): LoadReportsFinancialSummaryUseCase => ({
  async execute(profileId: string): Promise<Result<ReportFinancialSummary>> {
    const result = await dependencies.getFinanceSummaryUseCase.execute(profileId);
    if (!result.success) {
      return createFailure(createReportsError("load_failed"));
    }

    return { success: true, value: result.value };
  },
});
