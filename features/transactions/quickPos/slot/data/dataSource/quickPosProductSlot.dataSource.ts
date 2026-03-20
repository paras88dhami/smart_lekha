import type { Result } from "@/shared/types/result.types";
import type {
  CreateQuickPosProductSlotInput,
  UpdateQuickPosProductSlotItemInput,
} from "../../types/types";
import type { QuickPosProductSlotModel } from "./quickPosProductSlot.model";

export interface QuickPosProductSlotDataSource {
  getSlotsByProfileId(profileId: string): Promise<Result<QuickPosProductSlotModel[]>>;
  createSlot(input: CreateQuickPosProductSlotInput): Promise<Result<QuickPosProductSlotModel>>;
  updateSlotItem(input: UpdateQuickPosProductSlotItemInput): Promise<Result<void>>;
}
