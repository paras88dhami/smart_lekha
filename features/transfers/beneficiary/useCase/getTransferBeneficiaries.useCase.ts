import type { Result } from "@/shared/types/result.types";
import type { TransferBeneficiary } from "../types/types";

export interface GetTransferBeneficiariesUseCase {
  execute(profileId: string): Promise<Result<TransferBeneficiary[]>>;
}
