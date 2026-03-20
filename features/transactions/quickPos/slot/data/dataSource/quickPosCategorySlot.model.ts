import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class QuickPosCategorySlotModel extends Model {
  static readonly table = "quick_pos_category_slots";

  @field("profile_id") profileId!: string;
  @field("slot_order") slotOrder!: number;
  @field("category_name") categoryName!: string | null;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
