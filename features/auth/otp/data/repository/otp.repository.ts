import type { AuthResult } from "@/features/auth/shared/authError.types";
import type {
  RequestOtpInput,
  RequestOtpResult,
  VerifyOtpInput,
  VerifyOtpResult,
} from "../../types/types";

export interface OtpRepository {
  requestOtp(input: RequestOtpInput): Promise<AuthResult<RequestOtpResult>>;
  verifyOtp(input: VerifyOtpInput): Promise<AuthResult<VerifyOtpResult>>;
}
