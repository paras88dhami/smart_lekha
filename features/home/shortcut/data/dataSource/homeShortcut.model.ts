import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type HomeShortcutKey =
  | "my_profile"
  | "my_accounts"
  | "statement"
  | "esewa"
  | "quick_pos"
  | "send_money";

export class HomeShortcutModel extends Model {
  static readonly table = "home_shortcuts";

  @field("profile_id") profileId!: string;
  @field("shortcut_key") shortcutKey!: HomeShortcutKey;
  @field("sort_order") sortOrder!: number;
  @field("is_enabled") isEnabled!: boolean;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
