import type { Result } from "@/shared/types/result.types";
import type { CountryIsoType } from "../../../shared/country.types";
import type { OtpRequestModel } from "./otpRequest.model";

export type UpsertOtpRequestInput = {
  phoneNumber: string;
  countryCode: string;
  countryIso: CountryIsoType;
  otpReferenceId: string;
  expiresAt: number;
};

export interface OtpRequestDataSource {
  upsertOtpRequest(input: UpsertOtpRequestInput): Promise<Result<OtpRequestModel>>;
  getOtpRequestByReferenceId(
    otpReferenceId: string,
  ): Promise<Result<OtpRequestModel | null>>;
  markOtpRequestConsumed(otpReferenceId: string): Promise<Result<void>>;
}
