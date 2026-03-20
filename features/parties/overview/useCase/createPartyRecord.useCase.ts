import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type { Result } from "@/shared/types/result.types";

export type CreatePartyRecordCommand = {
  partyNameInput: string;
  bankNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  selectedTransferMethod: TransferMethod;
  markAsFavorite: boolean;
};

export interface CreatePartyRecordUseCase {
  execute(input: CreatePartyRecordCommand): Promise<Result<void>>;
}
