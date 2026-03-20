import type { Result } from "@/shared/types/result.types";
import { normalizeTransferMethod } from "@/features/transfers/shared/config/transferMethodCatalog";
import type {
  CreateTransferBeneficiaryInput,
  TransferBeneficiary,
} from "../../types/types";
import type {
  CreateTransferBeneficiaryRecord,
  TransferBeneficiaryDataSource,
} from "../dataSource/transferBeneficiary.dataSource";
import type { TransferBeneficiaryModel } from "../dataSource/transferBeneficiary.model";
import type { TransferBeneficiaryRepository } from "./transferBeneficiary.repository";

const mapBeneficiary = (
  record: TransferBeneficiaryModel,
): TransferBeneficiary => ({
  id: record.id,
  profileId: record.profileId.trim(),
  beneficiaryName: record.beneficiaryName.trim(),
  bankName: record.bankName?.trim() ?? null,
  accountNumber: record.accountNumber?.trim() ?? null,
  mobileNumber: record.mobileNumber?.trim() ?? null,
  transferMethod: normalizeTransferMethod(record.transferMethod),
  isFavorite: record.isFavorite,
});

const toPayload = (
  input: CreateTransferBeneficiaryInput,
): CreateTransferBeneficiaryRecord => {
  return {
    profileId: input.profileId.trim(),
    beneficiaryName: input.beneficiaryName.trim(),
    bankName: input.bankName?.trim() ?? null,
    accountNumber: input.accountNumber?.trim() ?? null,
    mobileNumber: input.mobileNumber?.trim() ?? null,
    transferMethod: input.transferMethod,
    isFavorite: input.isFavorite,
  };
};

const createFailure = <T>(error: Error): Result<T> => ({
  success: false,
  error,
});

export const createTransferBeneficiaryRepository = (
  localDataSource: TransferBeneficiaryDataSource,
): TransferBeneficiaryRepository => ({
  async getByProfileId(profileId: string): Promise<Result<TransferBeneficiary[]>> {
    const result = await localDataSource.getByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<TransferBeneficiary[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapBeneficiary),
    };
  },

  async getFavoritesByProfileId(
    profileId: string,
  ): Promise<Result<TransferBeneficiary[]>> {
    const result = await localDataSource.getFavoritesByProfileId(profileId.trim());

    if (!result.success) {
      return createFailure<TransferBeneficiary[]>(result.error);
    }

    return {
      success: true,
      value: result.value.map(mapBeneficiary),
    };
  },

  async createBeneficiary(
    input: CreateTransferBeneficiaryInput,
  ): Promise<Result<TransferBeneficiary>> {
    const result = await localDataSource.createBeneficiary(toPayload(input));

    if (!result.success) {
      return createFailure<TransferBeneficiary>(result.error);
    }

    return {
      success: true,
      value: mapBeneficiary(result.value),
    };
  },
});
