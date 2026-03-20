import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";

export type TransferBeneficiary = {
  id: string;
  profileId: string;
  beneficiaryName: string;
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
  transferMethod: TransferMethod;
  isFavorite: boolean;
};

export type CreateTransferBeneficiaryInput = {
  profileId: string;
  beneficiaryName: string;
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
  transferMethod: TransferMethod;
  isFavorite: boolean;
};
