import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type PosSaleStatus = "success" | "pending" | "failed";
export type PosPaymentMode = "cash" | "bank" | "wallet";

export class PosSaleModel extends Model {
  static readonly table = "pos_sales";

  @field("profile_id") profileId?: string;
  @field("account_id") accountId?: string | null;
  @field("sale_number") saleNumber?: string;
  @field("line_items_json") lineItemsJson?: string;
  @field("total_amount") totalAmount?: number;
  @field("payment_mode") paymentMode?: PosPaymentMode;
  @field("status") status?: PosSaleStatus;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
