import type { Result } from "@/shared/types/result.types";
import type {
  TransferBeneficiaryModel,
  TransferMethod,
} from "./transferBeneficiary.model";

export type CreateTransferBeneficiaryRecord = {
  profileId: string;
  beneficiaryName: string;
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
  transferMethod: TransferMethod;
  isFavorite: boolean;
};

export interface TransferBeneficiaryDataSource {
  getByProfileId(profileId: string): Promise<Result<TransferBeneficiaryModel[]>>;
  getFavoritesByProfileId(
    profileId: string,
  ): Promise<Result<TransferBeneficiaryModel[]>>;
  createBeneficiary(
    payload: CreateTransferBeneficiaryRecord,
  ): Promise<Result<TransferBeneficiaryModel>>;
}
