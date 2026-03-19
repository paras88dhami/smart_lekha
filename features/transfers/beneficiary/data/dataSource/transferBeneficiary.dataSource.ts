import type { Result } from "@/shared/types/result.types";
import type { TransferBeneficiaryModel } from "./transferBeneficiary.model";

export interface TransferBeneficiaryDataSource {
  getByProfileId(profileId: string): Promise<Result<TransferBeneficiaryModel[]>>;
  getFavoritesByProfileId(
    profileId: string,
  ): Promise<Result<TransferBeneficiaryModel[]>>;
  createBeneficiary(
    payload: TransferBeneficiaryModel,
  ): Promise<Result<TransferBeneficiaryModel>>;
}
