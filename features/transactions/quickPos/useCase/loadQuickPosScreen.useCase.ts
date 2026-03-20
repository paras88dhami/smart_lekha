import type { PosItem } from "@/features/pos/item/types/types";
import type { QuickPosProductSlot } from "../slot/types/types";
import type { QuickPosResult } from "./quickPosError";

export type QuickPosScreenData = {
  profileId: string;
  items: PosItem[];
  productSlots: QuickPosProductSlot[];
};

export interface LoadQuickPosScreenUseCase {
  execute(): Promise<QuickPosResult<QuickPosScreenData>>;
}
