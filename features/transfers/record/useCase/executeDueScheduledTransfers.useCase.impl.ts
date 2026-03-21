import type { Result } from "@/shared/types/result.types";
import type { GetDueScheduledTransfersUseCase } from "./getDueScheduledTransfers.useCase";
import type { UpdateTransferRecordStatusUseCase } from "./updateTransferRecordStatus.useCase";
import type { ExecuteTransferRecordUseCase } from "./executeTransferRecord.useCase";
import type { ExecuteDueScheduledTransfersUseCase } from "./executeDueScheduledTransfers.useCase";

type Dependencies = {
  getDueScheduledTransfersUseCase: GetDueScheduledTransfersUseCase;
  executeTransferRecordUseCase: ExecuteTransferRecordUseCase;
  updateTransferRecordStatusUseCase: UpdateTransferRecordStatusUseCase;
};

const createFailure = (message: string): Result<void> => {
  return { success: false, error: new Error(message) };
};

const updateTransferExecutionStatus = async (
  transferRecordId: string,
  status: "completed" | "failed",
  updateTransferRecordStatusUseCase: UpdateTransferRecordStatusUseCase,
): Promise<Result<void>> => {
  const result = await updateTransferRecordStatusUseCase.execute({
    recordId: transferRecordId,
    status,
  });

  if (!result.success) {
    return createFailure(result.error.message);
  }

  return { success: true, value: undefined };
};

export const createExecuteDueScheduledTransfersUseCase = (
  dependencies: Dependencies,
): ExecuteDueScheduledTransfersUseCase => ({
  async execute(profileId: string): Promise<Result<void>> {
    const dueTransfersResult = await dependencies.getDueScheduledTransfersUseCase.execute(
      profileId,
      Date.now(),
    );

    if (!dueTransfersResult.success) {
      return createFailure(dueTransfersResult.error.message);
    }

    for (const transferRecord of dueTransfersResult.value) {
      const executionResult = await dependencies.executeTransferRecordUseCase.execute({
        transferRecord,
      });
      const status = executionResult.success ? "completed" : "failed";
      const statusResult = await updateTransferExecutionStatus(
        transferRecord.id,
        status,
        dependencies.updateTransferRecordStatusUseCase,
      );

      if (!statusResult.success) {
        return statusResult;
      }
    }

    return { success: true, value: undefined };
  },
});
