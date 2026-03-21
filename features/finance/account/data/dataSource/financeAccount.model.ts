import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type FinanceAccountType = "cash" | "bank" | "wallet";

export class FinanceAccountModel extends Model {
  static readonly table = "finance_accounts";

  @field("profile_id") profileId!: string;
  @field("account_name") accountName!: string;
  @field("account_number") accountNumber!: string | null;
  @field("account_type") accountType!: FinanceAccountType;
  @field("is_primary") isPrimary!: boolean;
  @field("is_archived") isArchived!: boolean;
  @field("currency_code") currencyCode!: string;
  @field("current_balance") currentBalance!: number;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
