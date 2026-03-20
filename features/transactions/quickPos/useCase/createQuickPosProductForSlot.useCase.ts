import type { QuickPosResult } from "./quickPosError";

export type CreateQuickPosProductForSlotInput = {
  profileId: string;
  slotId: string;
  itemName: string;
  sku: string | null;
  unitPrice: number;
  availableStock: number;
};

export interface CreateQuickPosProductForSlotUseCase {
  execute(input: CreateQuickPosProductForSlotInput): Promise<QuickPosResult<void>>;
}
