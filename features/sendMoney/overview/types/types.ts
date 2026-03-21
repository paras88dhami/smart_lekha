import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { StatusType } from "@/shared/types/status.types";
import type { TransferRecordTargetType } from "@/features/transfers/record/data/dataSource/transferRecord.model";

export type SendMoneyBeneficiaryItem = {
  id: string;
  beneficiaryName: string;
  bankName: string | null;
  accountNumber: string | null;
  mobileNumber: string | null;
  transferMethod: TransferMethod;
};

export type SendMoneyAccountItem = {
  id: string;
  accountName: string;
  accountType: FinanceAccountType;
  currencyCode: string;
  currentBalance: number;
};

export type SendMoneyTransferItem = {
  id: string;
  beneficiaryId: string | null;
  fromAccountId: string | null;
  toAccountId: string | null;
  targetName: string;
  targetType: TransferRecordTargetType;
  transferMethod: TransferMethod;
  sourceAccountName: string | null;
  destinationAccountName: string | null;
  amount: number;
  note: string | null;
  recordType: "saved" | "scheduled" | "instant";
  status: "pending" | "completed" | "failed";
  createdAt: number;
  scheduledFor: number | null;
};

export type SendMoneyOverviewData = {
  accounts: SendMoneyAccountItem[];
  activeAccountId: string;
  beneficiaries: SendMoneyBeneficiaryItem[];
  favorites: SendMoneyBeneficiaryItem[];
  savedTransfers: SendMoneyTransferItem[];
  scheduledTransfers: SendMoneyTransferItem[];
};

export type SendMoneyFormState = {
  targetType: TransferRecordTargetType;
  sourceAccountId: string;
  destinationAccountId: string;
  beneficiaryNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  amountInput: string;
  noteInput: string;
  isScheduled: boolean;
};

export type SendMoneyState = {
  status: StatusType;
  selectedMethod: TransferMethod;
  accounts: SendMoneyAccountItem[];
  beneficiaries: SendMoneyBeneficiaryItem[];
  favorites: SendMoneyBeneficiaryItem[];
  savedTransfers: SendMoneyTransferItem[];
  scheduledTransfers: SendMoneyTransferItem[];
  showAddTransferForm: boolean;
  form: SendMoneyFormState;
  errorMessage: string;
};

export interface SendMoneyViewModel {
  state: SendMoneyState;
  onRefreshPress(): Promise<void>;
  onMethodPress(method: TransferMethod): void;
  onToggleAddTransferPress(): void;
  onTargetTypePress(targetType: TransferRecordTargetType): void;
  onSourceAccountPress(accountId: string): void;
  onDestinationAccountPress(accountId: string): void;
  onBeneficiaryNameChange(value: string): void;
  onAccountNumberChange(value: string): void;
  onMobileNumberChange(value: string): void;
  onAmountChange(value: string): void;
  onNoteChange(value: string): void;
  onScheduleTogglePress(): void;
  onSubmitTransferPress(): Promise<void>;
  onViewAllSavedPress(): void;
}
