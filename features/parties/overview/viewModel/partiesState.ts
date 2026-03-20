import { Status } from "@/shared/types/status.types";
import { DEFAULT_TRANSFER_METHOD } from "@/features/transfers/shared/types/transferMethod.types";
import type { PartiesOverviewData, PartiesState, PartyFormState } from "../types/types";

export const createPartyFormState = (): PartyFormState => {
  return {
    partyNameInput: "",
    bankNameInput: "",
    accountNumberInput: "",
    mobileNumberInput: "",
    selectedTransferMethod: DEFAULT_TRANSFER_METHOD,
    markAsFavorite: true,
  };
};

export const createInitialPartiesState = (): PartiesState => {
  return {
    status: Status.Idle,
    profileName: "",
    parties: [],
    showAddPartyForm: false,
    form: createPartyFormState(),
    errorMessage: "",
  };
};

export const createLoadingPartiesState = (state: PartiesState): PartiesState => {
  return { ...state, status: Status.Loading, errorMessage: "" };
};

export const createFailurePartiesState = (
  state: PartiesState,
  errorMessage: string,
): PartiesState => {
  return { ...state, status: Status.Failure, errorMessage };
};

export const createSuccessPartiesState = (
  state: PartiesState,
  data: PartiesOverviewData,
): PartiesState => {
  return {
    ...state,
    status: Status.Success,
    profileName: data.profileName,
    parties: data.parties,
    errorMessage: "",
  };
};
