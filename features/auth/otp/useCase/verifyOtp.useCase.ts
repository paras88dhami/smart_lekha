import type { AuthResult } from "../../shared/authError.types";
import type { VerifyOtpInput, VerifyOtpResult } from "../types/types";

export interface VerifyOtpUseCase {
  execute(input: VerifyOtpInput): Promise<AuthResult<VerifyOtpResult>>;
}
