import type { Result } from "@/shared/types/result.types";

export type AssignQuickPosProductSlotInput = {
  slotId: string;
  itemId: string | null;
};

export interface AssignQuickPosProductSlotUseCase {
  execute(input: AssignQuickPosProductSlotInput): Promise<Result<void>>;
}
