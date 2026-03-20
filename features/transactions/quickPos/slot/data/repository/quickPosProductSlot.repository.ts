import type { Result } from "@/shared/types/result.types";
import type {
  CreateQuickPosProductSlotInput,
  QuickPosProductSlot,
  UpdateQuickPosProductSlotItemInput,
} from "../../types/types";

export interface QuickPosProductSlotRepository {
  getSlotsByProfileId(profileId: string): Promise<Result<QuickPosProductSlot[]>>;
  createSlot(input: CreateQuickPosProductSlotInput): Promise<Result<QuickPosProductSlot>>;
  updateSlotItem(input: UpdateQuickPosProductSlotItemInput): Promise<Result<void>>;
}
