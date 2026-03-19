import type { TransferMethod } from "../data/dataSource/transferBeneficiary.model";

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
