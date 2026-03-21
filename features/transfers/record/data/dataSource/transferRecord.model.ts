import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";

export type TransferRecordType = "saved" | "scheduled" | "instant";
export type TransferRecordStatus = "pending" | "completed" | "failed";
export type TransferRecordTargetType = "beneficiary" | "own_account";

export class TransferRecordModel extends Model {
  static readonly table = "transfer_records";

  @field("profile_id") profileId!: string;
  @field("beneficiary_id") beneficiaryId!: string;
  @field("from_account_id") fromAccountId!: string | null;
  @field("to_account_id") toAccountId!: string | null;
  @field("target_name") targetName!: string | null;
  @field("target_type") targetType!: TransferRecordTargetType | null;
  @field("transfer_method") transferMethod!: TransferMethod | null;
  @field("amount") amount!: number;
  @field("note") note!: string | null;
  @field("record_type") recordType!: TransferRecordType;
  @field("scheduled_for") scheduledFor!: number | null;
  @field("status") status!: TransferRecordStatus;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
