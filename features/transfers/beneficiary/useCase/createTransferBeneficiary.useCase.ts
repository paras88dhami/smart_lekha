import type { Result } from "@/shared/types/result.types";
import type {
  CreateTransferBeneficiaryInput,
  TransferBeneficiary,
} from "../types/types";

export interface CreateTransferBeneficiaryUseCase {
  execute(
    input: CreateTransferBeneficiaryInput,
  ): Promise<Result<TransferBeneficiary>>;
}
