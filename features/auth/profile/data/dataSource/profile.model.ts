import { Model, Query } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";
import { BusinessProfileModel } from "@/features/auth/businessProfile/data/dataSource/businessProfile.model";

export type ProfileType = "personal" | "business";

export class ProfileModel extends Model {
  static readonly table = "profiles";
  static associations = {
    business_profiles: { type: "has_many", foreignKey: "profile_id" },
  } as const;

  @field("account_id") accountId!: string;
  @field("profile_type") profileType!: ProfileType;
  @field("profile_name") profileName!: string;
  @field("display_name") displayName!: string | null;
  @field("role_name") roleName!: string | null;
  @field("is_active") isActive!: boolean;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;

  @children("business_profiles") businessProfiles!: Query<BusinessProfileModel>;
}
