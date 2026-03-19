import type { Result } from "@/shared/types/result.types";
import type { TransferBeneficiary } from "../types/types";

export interface GetFavoriteTransferBeneficiariesUseCase {
  execute(profileId: string): Promise<Result<TransferBeneficiary[]>>;
}
