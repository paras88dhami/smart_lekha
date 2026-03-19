import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import type { StatusType } from "@/shared/types/status.types";

export type SendMoneyBeneficiaryItem = {
  id: string;
  beneficiaryName: string;
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
  transferMethod: TransferMethod;
};

export type SendMoneyTransferItem = {
  id: string;
  beneficiaryId: string;
  amount: number;
  note: string | null;
  recordType: "saved" | "scheduled" | "instant";
  status: "pending" | "completed" | "failed";
  createdAt: number;
  scheduledFor: number | null;
};

export type SendMoneyState = {
  status: StatusType;
  selectedMethod: TransferMethod;
  favorites: SendMoneyBeneficiaryItem[];
  savedTransfers: SendMoneyTransferItem[];
  showAddTransferForm: boolean;
  beneficiaryNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  amountInput: string;
  noteInput: string;
  isScheduled: boolean;
  errorMessage: string;
};

export interface SendMoneyViewModel {
  state: SendMoneyState;
  onRefreshPress(): Promise<void>;
  onMethodPress(method: TransferMethod): void;
  onToggleAddTransferPress(): void;
  onBeneficiaryNameChange(value: string): void;
  onAccountNumberChange(value: string): void;
  onMobileNumberChange(value: string): void;
  onAmountChange(value: string): void;
  onNoteChange(value: string): void;
  onScheduleTogglePress(): void;
  onSubmitTransferPress(): Promise<void>;
  onViewAllSavedPress(): void;
}
