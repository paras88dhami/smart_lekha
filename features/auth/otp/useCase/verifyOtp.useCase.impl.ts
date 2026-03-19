import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { OtpRepository } from "../data/repository/otp.repository";
import type { VerifyOtpInput, VerifyOtpResult } from "../types/types";
import type { VerifyOtpUseCase } from "./verifyOtp.useCase";

export const createVerifyOtpUseCase = (
  repository: OtpRepository,
): VerifyOtpUseCase => ({
  async execute(input: VerifyOtpInput): Promise<AuthResult<VerifyOtpResult>> {
    return repository.verifyOtp(input);
  },
});
