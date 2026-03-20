import type { Result } from "@/shared/types/result.types";
import type { GetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase";
import type { GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase";
import { createReportsError } from "../reportsError";
import type { LoadReportsTransferSummaryUseCase } from "./loadReportsTransferSummary.useCase";
import type { ReportTransferSummary } from "../../types/types";

type Dependencies = {
  getSavedTransfersUseCase: GetSavedTransfersUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
};

const createFailure = (error: Error): Result<ReportTransferSummary> => {
  return { success: false, error };
};

export const createLoadReportsTransferSummaryUseCase = (
  dependencies: Dependencies,
): LoadReportsTransferSummaryUseCase => ({
  async execute(profileId: string): Promise<Result<ReportTransferSummary>> {
    const [savedTransfersResult, scheduledTransfersResult] = await Promise.all([
      dependencies.getSavedTransfersUseCase.execute(profileId, 100),
      dependencies.getScheduledTransfersUseCase.execute(profileId, 100),
    ]);

    if (!savedTransfersResult.success || !scheduledTransfersResult.success) {
      return createFailure(createReportsError("load_failed"));
    }

    return {
      success: true,
      value: {
        savedTransfersCount: savedTransfersResult.value.length,
        scheduledTransfersCount: scheduledTransfersResult.value.length,
      },
    };
  },
});
