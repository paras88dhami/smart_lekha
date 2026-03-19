import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class BusinessCategoryModel extends Model {
  static readonly table = "business_categories";

  @field("name") name?: string;
  @field("parent_id") parentId?: string | null;
  @field("slug") slug?: string;
  @field("is_active") isActive?: boolean;
  @field("sort_order") sortOrder?: number;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
