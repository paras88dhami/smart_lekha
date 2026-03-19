import type { Result } from "@/shared/types/result.types";
import type {
  CreateTransferBeneficiaryInput,
  TransferBeneficiary,
} from "../../types/types";

export interface TransferBeneficiaryRepository {
  getByProfileId(profileId: string): Promise<Result<TransferBeneficiary[]>>;
  getFavoritesByProfileId(profileId: string): Promise<Result<TransferBeneficiary[]>>;
  createBeneficiary(
    input: CreateTransferBeneficiaryInput,
  ): Promise<Result<TransferBeneficiary>>;
}
