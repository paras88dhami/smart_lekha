import type { Result } from "@/shared/types/result.types";
import type { TransferBeneficiary } from "@/features/transfers/beneficiary/types/types";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";

export type ResolveSendMoneyBeneficiaryInput = {
  profileId: string;
  beneficiaryName: string;
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
  transferMethod: TransferMethod;
};

export interface ResolveSendMoneyBeneficiaryUseCase {
  execute(input: ResolveSendMoneyBeneficiaryInput): Promise<Result<TransferBeneficiary>>;
}
