import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class AppSettingModel extends Model {
  static readonly table = "app_settings";

  @field("selected_language") selectedLanguage?: string | null;
  @field("onboarding_completed") onboardingCompleted?: boolean;
  @field("active_profile_id") activeProfileId?: string | null;
  @field("last_selected_country_iso") lastSelectedCountryIso?: string | null;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
