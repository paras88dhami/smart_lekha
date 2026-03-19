import type { Result } from "@/shared/types/result.types";
import type { TransferBeneficiary } from "../types/types";
import type { TransferBeneficiaryRepository } from "../data/repository/transferBeneficiary.repository";
import type { GetTransferBeneficiariesUseCase } from "./getTransferBeneficiaries.useCase";

export const createGetTransferBeneficiariesUseCase = (
  repository: TransferBeneficiaryRepository,
): GetTransferBeneficiariesUseCase => ({
  async execute(profileId: string): Promise<Result<TransferBeneficiary[]>> {
    return repository.getByProfileId(profileId);
  },
});
