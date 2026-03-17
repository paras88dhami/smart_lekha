import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import { ProfileModel } from "@/features/auth/profile/data/dataSource/profile.model";
import { BusinessCategoryModel } from "@/features/auth/businessCategory/data/dataSource/businessCategory.model";

export class BusinessProfileModel extends Model {
  static readonly table = "business_profiles";
  static associations = {
    profiles: { type: "belongs_to", key: "profile_id" },
    business_categories: { type: "belongs_to", key: "business_category_id" },
  } as const;

  @field("profile_id") profileId!: string;
  @field("business_name") businessName!: string;
  @field("business_category_id") businessCategoryId!: string | null;
  @field("business_category_name") businessCategoryName!: string | null;
  @field("country_iso") countryIso!: string | null;
  @field("currency_code") currencyCode!: string | null;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;

  @relation("profiles", "profile_id") profile!: ProfileModel;
  @relation("business_categories", "business_category_id")
  businessCategory!: BusinessCategoryModel;
}
