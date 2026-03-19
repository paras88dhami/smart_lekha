import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type FinanceEntryType =
  | "income"
  | "expense"
  | "payment_in"
  | "payment_out"
  | "transfer_out"
  | "transfer_in"
  | "pos_sale";

export type FinanceEntryStatus = "success" | "pending" | "failed";

export class FinanceTransactionModel extends Model {
  static readonly table = "finance_transactions";

  @field("profile_id") profileId?: string;
  @field("account_id") accountId?: string | null;
  @field("entry_type") entryType?: FinanceEntryType;
  @field("category_name") categoryName?: string | null;
  @field("counterparty_name") counterpartyName?: string | null;
  @field("note") note?: string | null;
  @field("status") status?: FinanceEntryStatus;
  @field("amount") amount?: number;
  @field("occurred_at") occurredAt?: number;
  @field("reference_id") referenceId?: string | null;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
