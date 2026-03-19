import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class PosItemModel extends Model {
  static readonly table = "pos_items";

  @field("profile_id") profileId?: string;
  @field("item_name") itemName?: string;
  @field("sku") sku?: string | null;
  @field("unit_price") unitPrice?: number;
  @field("available_stock") availableStock?: number;
  @field("is_active") isActive?: boolean;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
