import type { TransferBeneficiary } from "@/features/transfers/beneficiary/types/types";
import type { PartyItem } from "../types/types";

export const mapPartyItem = (beneficiary: TransferBeneficiary): PartyItem => {
  return {
    id: beneficiary.id,
    name: beneficiary.beneficiaryName,
    bankName: beneficiary.bankName,
    accountNumber: beneficiary.accountNumber,
    mobileNumber: beneficiary.mobileNumber,
    transferMethod: beneficiary.transferMethod,
    isFavorite: beneficiary.isFavorite,
  };
};
