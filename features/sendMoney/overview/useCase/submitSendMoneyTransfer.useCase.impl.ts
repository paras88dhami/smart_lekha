import type { Result } from "@/shared/types/result.types";
import type { CreateTransferRecordUseCase } from "@/features/transfers/record/useCase/createTransferRecord.useCase";
import type { ExecuteTransferRecordUseCase } from "@/features/transfers/record/useCase/executeTransferRecord.useCase";
import type { UpdateTransferRecordStatusUseCase } from "@/features/transfers/record/useCase/updateTransferRecordStatus.useCase";
import type { GetFinanceAccountByIdUseCase } from "@/features/finance/account/useCase/getFinanceAccountById.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createSendMoneyError } from "./sendMoneyError";
import {
  createSendMoneyFailure,
  loadSendMoneyAccount,
  parseTransferAmount,
  resolveBeneficiaryTransferTarget,
  resolveOwnAccountTransferTarget,
} from "./submitSendMoneyTransfer.helpers";
import type { ResolveSendMoneyBeneficiaryUseCase } from "./resolveSendMoneyBeneficiary.useCase";
import type {
  SubmitSendMoneyTransferCommand,
  SubmitSendMoneyTransferUseCase,
} from "./submitSendMoneyTransfer.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountByIdUseCase: GetFinanceAccountByIdUseCase;
  resolveSendMoneyBeneficiaryUseCase: ResolveSendMoneyBeneficiaryUseCase;
  createTransferRecordUseCase: CreateTransferRecordUseCase;
  executeTransferRecordUseCase: ExecuteTransferRecordUseCase;
  updateTransferRecordStatusUseCase: UpdateTransferRecordStatusUseCase;
};

const updateTransferStatus = async (
  recordId: string,
  status: "completed" | "failed",
  updateTransferRecordStatusUseCase: UpdateTransferRecordStatusUseCase,
): Promise<Result<void>> => {
  const result = await updateTransferRecordStatusUseCase.execute({
    recordId,
    status,
  });

  if (!result.success) {
    return createSendMoneyFailure("save_failed");
  }

  return { success: true, value: undefined };
};

export const createSubmitSendMoneyTransferUseCase = (
  dependencies: Dependencies,
): SubmitSendMoneyTransferUseCase => ({
  async execute(input: SubmitSendMoneyTransferCommand): Promise<Result<void>> {
    const parsedAmount = parseTransferAmount(input.amountInput);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return createSendMoneyFailure("invalid_amount");
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();

    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createSendMoneyFailure("no_active_profile");
    }

    const sourceAccountResult = await loadSendMoneyAccount(
      activeProfileResult.value.profileId,
      input.sourceAccountId,
      "invalid_source_account",
      dependencies.getFinanceAccountByIdUseCase,
    );

    if (!sourceAccountResult.success) {
      return sourceAccountResult;
    }

    const transferTargetResult =
      input.targetType === "own_account"
        ? await resolveOwnAccountTransferTarget(
            activeProfileResult.value.profileId,
            sourceAccountResult.value.id,
            input.destinationAccountId,
            dependencies.getFinanceAccountByIdUseCase,
          )
        : await resolveBeneficiaryTransferTarget(
            activeProfileResult.value.profileId,
            input,
            dependencies.resolveSendMoneyBeneficiaryUseCase,
          );

    if (!transferTargetResult.success) {
      return transferTargetResult;
    }

    const transferRecordResult = await dependencies.createTransferRecordUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      beneficiaryId: transferTargetResult.value.beneficiaryId,
      fromAccountId: sourceAccountResult.value.id,
      toAccountId: transferTargetResult.value.toAccountId,
      targetName: transferTargetResult.value.targetName,
      targetType: input.targetType,
      transferMethod: transferTargetResult.value.transferMethod,
      amount: parsedAmount,
      note: input.noteInput.trim() || null,
      recordType: input.isScheduled ? "scheduled" : "saved",
      scheduledFor: input.isScheduled ? Date.now() + 24 * 60 * 60 * 1000 : null,
      status: "pending",
    });

    if (!transferRecordResult.success) {
      return createSendMoneyFailure("save_failed");
    }

    if (input.isScheduled) {
      return { success: true, value: undefined };
    }

    const executionResult = await dependencies.executeTransferRecordUseCase.execute({
      transferRecord: transferRecordResult.value,
    });
    const status = executionResult.success ? "completed" : "failed";
    const statusResult = await updateTransferStatus(
      transferRecordResult.value.id,
      status,
      dependencies.updateTransferRecordStatusUseCase,
    );

    if (!statusResult.success) {
      return statusResult;
    }

    if (!executionResult.success) {
      return { success: false, error: createSendMoneyError("save_failed") };
    }

    return { success: true, value: undefined };
  },
});
