import type { Result } from "@/shared/types/result.types";
import type { QuickPosProductSlotRepository } from "../data/repository/quickPosProductSlot.repository";
import type {
  AssignQuickPosProductSlotInput,
  AssignQuickPosProductSlotUseCase,
} from "./assignQuickPosProductSlot.useCase";

export const createAssignQuickPosProductSlotUseCase = (
  repository: QuickPosProductSlotRepository,
): AssignQuickPosProductSlotUseCase => ({
  async execute(input: AssignQuickPosProductSlotInput): Promise<Result<void>> {
    return repository.updateSlotItem(input);
  },
});
