import { Model, Query } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";
import { BusinessProfileModel } from "@/features/auth/businessProfile/data/dataSource/businessProfile.model";

export class BusinessCategoryModel extends Model {
  static readonly table = "business_categories";
  static associations = {
    business_profiles: { type: "has_many", foreignKey: "business_category_id" },
  } as const;

  @field("name") name!: string;
  @field("parent_id") parentId!: string | null;
  @field("slug") slug!: string;
  @field("is_active") isActive!: boolean;
  @field("sort_order") sortOrder!: number;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;

  @children("business_profiles") businessProfiles!: Query<BusinessProfileModel>;
}
