import type { TransferBeneficiary } from "@/features/transfers/beneficiary/types/types";
import type { TransferRecord } from "@/features/transfers/record/types/types";
import type {
  SendMoneyBeneficiaryItem,
  SendMoneyTransferItem,
} from "../types/types";

export const mapSendMoneyBeneficiaryItem = (
  beneficiary: TransferBeneficiary,
): SendMoneyBeneficiaryItem => {
  return {
    id: beneficiary.id,
    beneficiaryName: beneficiary.beneficiaryName,
    bankName: beneficiary.bankName,
    accountNumber: beneficiary.accountNumber,
    mobileNumber: beneficiary.mobileNumber,
    transferMethod: beneficiary.transferMethod,
  };
};

export const mapSendMoneyTransferItem = (
  transferRecord: TransferRecord,
): SendMoneyTransferItem => {
  return {
    id: transferRecord.id,
    beneficiaryId: transferRecord.beneficiaryId,
    amount: transferRecord.amount,
    note: transferRecord.note,
    recordType: transferRecord.recordType,
    status: transferRecord.status,
    createdAt: transferRecord.createdAt,
    scheduledFor: transferRecord.scheduledFor,
  };
};
