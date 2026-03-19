import type { Result } from "@/shared/types/result.types";
import type {
  CreateTransferBeneficiaryInput,
  TransferBeneficiary,
} from "../types/types";
import type { TransferBeneficiaryRepository } from "../data/repository/transferBeneficiary.repository";
import type { CreateTransferBeneficiaryUseCase } from "./createTransferBeneficiary.useCase";

export const createCreateTransferBeneficiaryUseCase = (
  repository: TransferBeneficiaryRepository,
): CreateTransferBeneficiaryUseCase => ({
  async execute(
    input: CreateTransferBeneficiaryInput,
  ): Promise<Result<TransferBeneficiary>> {
    return repository.createBeneficiary(input);
  },
});
