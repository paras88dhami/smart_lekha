import type { AuthResult } from "../../shared/authError.types";
import type { RequestOtpInput, RequestOtpResult } from "../types/types";

export interface RequestOtpUseCase {
  execute(input: RequestOtpInput): Promise<AuthResult<RequestOtpResult>>;
}
