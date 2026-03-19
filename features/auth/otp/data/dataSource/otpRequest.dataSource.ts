import type { Result } from "@/shared/types/result.types";
import type { OtpRequestModel } from "./otpRequest.model";

export interface OtpRequestDataSource {
  upsertOtpRequest(payload: OtpRequestModel): Promise<Result<OtpRequestModel>>;
  getOtpRequestByReferenceId(
    otpReferenceId: string,
  ): Promise<Result<OtpRequestModel | null>>;
  markOtpRequestConsumed(otpReferenceId: string): Promise<Result<void>>;
}