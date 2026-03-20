import type { QuickPosResult } from "./quickPosError";

export type AssignQuickPosProductSelectionInput = {
  profileId: string;
  slotId: string;
  itemId: string | null;
};

export interface AssignQuickPosProductSelectionUseCase {
  execute(input: AssignQuickPosProductSelectionInput): Promise<QuickPosResult<void>>;
}
