import type { Result } from "@/shared/types/result.types";
import type { TransferBeneficiary } from "../types/types";
import type { TransferBeneficiaryRepository } from "../data/repository/transferBeneficiary.repository";
import type { GetFavoriteTransferBeneficiariesUseCase } from "./getFavoriteTransferBeneficiaries.useCase";

export const createGetFavoriteTransferBeneficiariesUseCase = (
  repository: TransferBeneficiaryRepository,
): GetFavoriteTransferBeneficiariesUseCase => ({
  async execute(profileId: string): Promise<Result<TransferBeneficiary[]>> {
    return repository.getFavoritesByProfileId(profileId);
  },
});
