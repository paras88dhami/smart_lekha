import type { Result } from "@/shared/types/result.types";
import type { QuickPosProductSlot } from "../types/types";

export type GetQuickPosProductSlotsInput = {
  profileId: string;
};

export interface GetQuickPosProductSlotsUseCase {
  execute(input: GetQuickPosProductSlotsInput): Promise<Result<QuickPosProductSlot[]>>;
}
