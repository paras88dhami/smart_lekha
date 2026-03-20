import type { Result } from "@/shared/types/result.types";
import type { CreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase";
import {
  hasRequiredTransferMethodInputs,
  sanitizeTransferMethodInputs,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createPartiesError } from "./partiesError";
import type { CreatePartyRecordUseCase, CreatePartyRecordCommand } from "./createPartyRecord.useCase";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  createTransferBeneficiaryUseCase: CreateTransferBeneficiaryUseCase;
};

const createFailure = (error: Error): Result<void> => {
  return { success: false, error };
};

export const createCreatePartyRecordUseCase = (
  dependencies: Dependencies,
): CreatePartyRecordUseCase => ({
  async execute(input: CreatePartyRecordCommand): Promise<Result<void>> {
    const beneficiaryName = input.partyNameInput.trim();
    const transferContactFields = sanitizeTransferMethodInputs(input.selectedTransferMethod, {
      bankNameInput: input.bankNameInput,
      accountNumberInput: input.accountNumberInput,
      mobileNumberInput: input.mobileNumberInput,
    });

    if (
      !beneficiaryName ||
      !hasRequiredTransferMethodInputs(input.selectedTransferMethod, transferContactFields)
    ) {
      return createFailure(createPartiesError("invalid_party"));
    }

    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createPartiesError("no_active_profile"));
    }

    const result = await dependencies.createTransferBeneficiaryUseCase.execute({
      profileId: activeProfileResult.value.profileId,
      beneficiaryName,
      bankName: transferContactFields.bankName,
      accountNumber: transferContactFields.accountNumber,
      mobileNumber: transferContactFields.mobileNumber,
      transferMethod: input.selectedTransferMethod,
      isFavorite: input.markAsFavorite,
    });
    if (!result.success) {
      return createFailure(createPartiesError("save_failed"));
    }

    return { success: true, value: undefined };
  },
});
