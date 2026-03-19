import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class OtpRequestModel extends Model {
  static readonly table = "otp_requests";

  @field("phone_number") phoneNumber?: string;
  @field("country_code") countryCode?: string;
  @field("country_iso") countryIso?: string;
  @field("otp_reference_id") otpReferenceId?: string;
  @field("expires_at") expiresAt?: number;
  @field("is_consumed") isConsumed?: boolean;
  @field("created_at") createdAt?: number;
  @field("updated_at") updatedAt?: number;
}
