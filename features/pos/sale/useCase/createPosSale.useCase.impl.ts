import type { Result } from "@/shared/types/result.types";
import type { CreatePosSaleInput, PosSale } from "../types/types";
import type { PosSaleRepository } from "../data/repository/posSale.repository";
import type { CreatePosSaleUseCase } from "./createPosSale.useCase";

export const createCreatePosSaleUseCase = (
  repository: PosSaleRepository,
): CreatePosSaleUseCase => ({
  async execute(input: CreatePosSaleInput): Promise<Result<PosSale>> {
    return repository.createSale(input);
  },
});
