import type { Result } from "@/shared/types/result.types";
import type { CreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase";
import type { GetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase";
import type { TransferBeneficiary } from "@/features/transfers/beneficiary/types/types";
import type {
  ResolveSendMoneyBeneficiaryInput,
  ResolveSendMoneyBeneficiaryUseCase,
} from "./resolveSendMoneyBeneficiary.useCase";

type Dependencies = {
  getTransferBeneficiariesUseCase: GetTransferBeneficiariesUseCase;
  createTransferBeneficiaryUseCase: CreateTransferBeneficiaryUseCase;
};

const matchesBeneficiary = (
  beneficiary: TransferBeneficiary,
  input: ResolveSendMoneyBeneficiaryInput,
): boolean => {
  return (
    beneficiary.beneficiaryName === input.beneficiaryName &&
    beneficiary.transferMethod === input.transferMethod &&
    beneficiary.accountNumber === input.accountNumber &&
    beneficiary.mobileNumber === input.mobileNumber
  );
};

export const createResolveSendMoneyBeneficiaryUseCase = (
  dependencies: Dependencies,
): ResolveSendMoneyBeneficiaryUseCase => ({
  async execute(
    input: ResolveSendMoneyBeneficiaryInput,
  ): Promise<Result<TransferBeneficiary>> {
    const beneficiariesResult = await dependencies.getTransferBeneficiariesUseCase.execute(
      input.profileId,
    );

    if (!beneficiariesResult.success) {
      return { success: false, error: beneficiariesResult.error };
    }

    const existingBeneficiary = beneficiariesResult.value.find((beneficiary) =>
      matchesBeneficiary(beneficiary, input),
    );

    if (existingBeneficiary) {
      return { success: true, value: existingBeneficiary };
    }

    return dependencies.createTransferBeneficiaryUseCase.execute({
      profileId: input.profileId,
      beneficiaryName: input.beneficiaryName,
      bankName: input.bankName,
      accountNumber: input.accountNumber,
      mobileNumber: input.mobileNumber,
      transferMethod: input.transferMethod,
      isFavorite: true,
    });
  },
});
