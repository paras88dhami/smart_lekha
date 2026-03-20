import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class QuickPosProductSlotModel extends Model {
  static readonly table = "quick_pos_product_slots";

  @field("profile_id") profileId!: string;
  @field("category_name") categoryName!: string;
  @field("slot_order") slotOrder!: number;
  @field("item_id") itemId!: string | null;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
