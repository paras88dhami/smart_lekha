import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type { StatusType } from "@/shared/types/status.types";

export type PartyItem = {
  id: string;
  name: string;
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
  transferMethod: TransferMethod;
  isFavorite: boolean;
};

export type PartiesOverviewData = {
  profileName: string;
  parties: PartyItem[];
};

export type PartyFormState = {
  partyNameInput: string;
  bankNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  selectedTransferMethod: TransferMethod;
  markAsFavorite: boolean;
};

export type PartiesState = {
  status: StatusType;
  profileName: string;
  parties: PartyItem[];
  showAddPartyForm: boolean;
  form: PartyFormState;
  errorMessage: string;
};

export interface PartiesViewModel {
  state: PartiesState;
  onRefreshPress(): Promise<void>;
  onToggleAddPartyPress(): void;
  onPartyNameChange(value: string): void;
  onBankNameChange(value: string): void;
  onAccountNumberChange(value: string): void;
  onMobileNumberChange(value: string): void;
  onTransferMethodPress(method: TransferMethod): void;
  onFavoriteTogglePress(): void;
  onSavePartyPress(): Promise<void>;
}
