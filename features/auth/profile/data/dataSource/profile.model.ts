import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export type ProfileType = "personal" | "business";

export class ProfileModel extends Model {
  static readonly table = "profiles";
  static associations = {
    business_profiles: { type: "has_many", foreignKey: "profile_id" },
  } as const;

  @field("account_id") accountId?: string;
  @field("profile_type") profileType?: ProfileType;
  @field("profile_name") profileName?: string;
  @field("display_name") displayName?: string | null;
  @field("role_name") roleName?: string | null;
  @field("business_category_id") businessCategoryId?: string | null;
  @field("business_category_name") businessCategoryName?: string | null;
  @field("is_active") isActive?: boolean;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
