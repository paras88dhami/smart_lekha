import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class AuthSessionModel extends Model {
  static readonly table = "auth_session";

  @field("account_id") accountId?: string | null;
  @field("phone_number") phoneNumber?: string;
  @field("country_code") countryCode?: string;
  @field("country_iso") countryIso?: string;
  @field("is_verified") isVerified?: boolean;
  @field("is_logged_in") isLoggedIn?: boolean;
  @field("access_token") accessToken?: string | null;
  @field("refresh_token") refreshToken?: string | null;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
