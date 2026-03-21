import { Status } from "@/shared/types/status.types";
import { DEFAULT_TRANSFER_METHOD } from "@/features/transfers/shared/types/transferMethod.types";
import type { TransferRecordTargetType } from "@/features/transfers/record/data/dataSource/transferRecord.model";
import type { SendMoneyFormState, SendMoneyOverviewData, SendMoneyState } from "../types/types";

const getDefaultTargetType = (): TransferRecordTargetType => {
  return "beneficiary";
};

const resolveSourceAccountId = (
  currentSourceAccountId: string,
  nextActiveAccountId: string,
  accountIds: string[],
): string => {
  if (currentSourceAccountId && accountIds.includes(currentSourceAccountId)) {
    return currentSourceAccountId;
  }

  return nextActiveAccountId;
};

const resolveDestinationAccountId = (
  sourceAccountId: string,
  currentDestinationAccountId: string,
  accountIds: string[],
): string => {
  const fallbackDestinationAccountId =
    accountIds.find((accountId) => accountId !== sourceAccountId) ?? "";

  if (
    currentDestinationAccountId &&
    currentDestinationAccountId !== sourceAccountId &&
    accountIds.includes(currentDestinationAccountId)
  ) {
    return currentDestinationAccountId;
  }

  return fallbackDestinationAccountId;
};

export const createSendMoneyFormState = (): SendMoneyFormState => {
  return {
    targetType: getDefaultTargetType(),
    sourceAccountId: "",
    destinationAccountId: "",
    beneficiaryNameInput: "",
    accountNumberInput: "",
    mobileNumberInput: "",
    amountInput: "",
    noteInput: "",
    isScheduled: false,
  };
};

export const createInitialSendMoneyState = (): SendMoneyState => {
  return {
    status: Status.Idle,
    selectedMethod: DEFAULT_TRANSFER_METHOD,
    accounts: [],
    beneficiaries: [],
    favorites: [],
    savedTransfers: [],
    scheduledTransfers: [],
    showAddTransferForm: false,
    form: createSendMoneyFormState(),
    errorMessage: "",
  };
};

export const createLoadingSendMoneyState = (state: SendMoneyState): SendMoneyState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createFailureSendMoneyState = (
  state: SendMoneyState,
  errorMessage: string,
): SendMoneyState => {
  return { ...state, status: Status.Failure, errorMessage };
};

export const createSuccessSendMoneyState = (
  state: SendMoneyState,
  data: SendMoneyOverviewData,
): SendMoneyState => {
  const accountIds = data.accounts.map((account) => account.id);
  const sourceAccountId = resolveSourceAccountId(
    state.form.sourceAccountId,
    data.activeAccountId,
    accountIds,
  );
  const destinationAccountId = resolveDestinationAccountId(
    sourceAccountId,
    state.form.destinationAccountId,
    accountIds,
  );

  return {
    ...state,
    status: Status.Success,
    accounts: data.accounts,
    beneficiaries: data.beneficiaries,
    favorites: data.favorites,
    savedTransfers: data.savedTransfers,
    scheduledTransfers: data.scheduledTransfers,
    form: {
      ...state.form,
      sourceAccountId,
      destinationAccountId,
    },
    errorMessage: "",
  };
};
