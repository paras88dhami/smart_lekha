import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type TransferRecordType = "saved" | "scheduled" | "instant";
export type TransferRecordStatus = "pending" | "completed" | "failed";

export class TransferRecordModel extends Model {
  static readonly table = "transfer_records";

  @field("profile_id") profileId?: string;
  @field("beneficiary_id") beneficiaryId?: string;
  @field("from_account_id") fromAccountId?: string | null;
  @field("amount") amount?: number;
  @field("note") note?: string | null;
  @field("record_type") recordType?: TransferRecordType;
  @field("scheduled_for") scheduledFor?: number | null;
  @field("status") status?: TransferRecordStatus;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
