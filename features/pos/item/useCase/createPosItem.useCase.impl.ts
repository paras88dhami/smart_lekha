import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemInput, PosItem } from "../types/types";
import type { PosItemRepository } from "../data/repository/posItem.repository";
import type { CreatePosItemUseCase } from "./createPosItem.useCase";

export const createCreatePosItemUseCase = (
  repository: PosItemRepository,
): CreatePosItemUseCase => ({
  async execute(input: CreatePosItemInput): Promise<Result<PosItem>> {
    return repository.createItem(input);
  },
});
