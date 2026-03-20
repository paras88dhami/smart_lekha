import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type TransferMethod =
  | "same_bank"
  | "other_bank"
  | "connect_ips"
  | "nepalpay_instant"
  | "adbl_pay";

export class TransferBeneficiaryModel extends Model {
  static readonly table = "transfer_beneficiaries";

  @field("profile_id") profileId!: string;
  @field("beneficiary_name") beneficiaryName!: string;
  @field("bank_name") bankName!: string | null;
  @field("account_number") accountNumber!: string | null;
  @field("mobile_number") mobileNumber!: string | null;
  @field("transfer_method") transferMethod!: TransferMethod;
  @field("is_favorite") isFavorite!: boolean;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
