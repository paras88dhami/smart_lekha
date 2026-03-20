import type { Result } from "@/shared/types/result.types";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import { buildReportEntryTypeTotals } from "../reportsData.mapper";
import { createReportsError } from "../reportsError";
import type { LoadReportEntryTypeTotalsUseCase } from "./loadReportEntryTypeTotals.useCase";
import type { ReportEntryTypeTotalItem } from "../../types/types";

type Dependencies = {
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
};

const createFailure = (error: Error): Result<ReportEntryTypeTotalItem[]> => {
  return { success: false, error };
};

export const createLoadReportEntryTypeTotalsUseCase = (
  dependencies: Dependencies,
): LoadReportEntryTypeTotalsUseCase => ({
  async execute(profileId: string): Promise<Result<ReportEntryTypeTotalItem[]>> {
    const result = await dependencies.getFinanceTransactionsUseCase.execute(profileId, 200);
    if (!result.success) {
      return createFailure(createReportsError("load_failed"));
    }

    return { success: true, value: buildReportEntryTypeTotals(result.value) };
  },
});
