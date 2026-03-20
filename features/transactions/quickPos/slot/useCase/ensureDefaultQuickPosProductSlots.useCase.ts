import type { Result } from "@/shared/types/result.types";
import type { PosItem } from "@/features/pos/item/types/types";

export type EnsureDefaultQuickPosProductSlotsInput = {
  profileId: string;
  items: PosItem[];
};

export interface EnsureDefaultQuickPosProductSlotsUseCase {
  execute(input: EnsureDefaultQuickPosProductSlotsInput): Promise<Result<void>>;
}
