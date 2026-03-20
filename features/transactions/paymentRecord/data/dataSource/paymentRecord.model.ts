import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type PaymentRecordDirection = "to_receive" | "to_pay";
export type PaymentRecordStatus = "open" | "settled";

export class PaymentRecordModel extends Model {
  static readonly table = "payment_records";

  @field("profile_id") profileId!: string;
  @field("direction") direction!: PaymentRecordDirection;
  @field("party_name") partyName!: string;
  @field("note") note!: string | null;
  @field("total_amount") totalAmount!: number;
  @field("settled_amount") settledAmount!: number;
  @field("status") status!: PaymentRecordStatus;
  @field("settled_at") settledAt!: number | null;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
