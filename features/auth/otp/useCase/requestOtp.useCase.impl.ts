import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { OtpRepository } from "../data/repository/otp.repository";
import type { RequestOtpInput, RequestOtpResult } from "../types/types";
import type { RequestOtpUseCase } from "./requestOtp.useCase";

export const createRequestOtpUseCase = (
  repository: OtpRepository,
): RequestOtpUseCase => ({
  async execute(input: RequestOtpInput): Promise<AuthResult<RequestOtpResult>> {
    return repository.requestOtp(input);
  },
});
