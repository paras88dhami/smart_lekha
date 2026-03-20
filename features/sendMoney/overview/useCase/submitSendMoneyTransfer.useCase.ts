import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type { Result } from "@/shared/types/result.types";

export type SubmitSendMoneyTransferCommand = {
  selectedMethod: TransferMethod;
  beneficiaryNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  amountInput: string;
  noteInput: string;
  isScheduled: boolean;
};

export interface SubmitSendMoneyTransferUseCase {
  execute(input: SubmitSendMoneyTransferCommand): Promise<Result<void>>;
}
