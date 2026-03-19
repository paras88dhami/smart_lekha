import type { OtpVerificationState } from "../types/types";

export interface OtpVerificationViewModel {
  state: OtpVerificationState;
  onOtpCodeChange(value: string): void;
  onVerifyPress(): Promise<void>;
  onResendPress(): Promise<void>;
  onClosePress(): void;
}
