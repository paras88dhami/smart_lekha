import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase";
import type { GetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase";
import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { PartiesState, PartiesViewModel } from "./parties.viewModel";

const TRANSFER_METHOD_OPTIONS: TransferMethod[] = [
  "same_bank",
  "other_bank",
  "connect_ips",
  "nepalpay_instant",
  "adbl_pay",
];

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getTransferBeneficiariesUseCase: GetTransferBeneficiariesUseCase;
  createTransferBeneficiaryUseCase: CreateTransferBeneficiaryUseCase;
};

export const usePartiesViewModel = (params: Params): PartiesViewModel => {
  const {
    getActiveProfileUseCase,
    getTransferBeneficiariesUseCase,
    createTransferBeneficiaryUseCase,
  } = params;

  const isLoadingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<PartiesState>({
    status: Status.Idle,
    profileName: "",
    parties: [],
    showAddPartyForm: false,
    partyNameInput: "",
    bankNameInput: "",
    accountNumberInput: "",
    mobileNumberInput: "",
    selectedTransferMethod: "other_bank",
    markAsFavorite: true,
    errorMessage: "",
  });

  const loadParties = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("parties.errors.noActiveProfile"),
        }));
        return;
      }

      const profile = activeProfileResult.value;
      const partiesResult = await getTransferBeneficiariesUseCase.execute(profile.profileId);

      if (!partiesResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("parties.errors.loadFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        profileName: profile.profileName,
        parties: partiesResult.value.map((party) => ({
          id: party.id,
          name: party.beneficiaryName,
          bankName: party.bankName,
          accountNumber: party.accountNumber,
          mobileNumber: party.mobileNumber,
          transferMethod: party.transferMethod,
          isFavorite: party.isFavorite,
        })),
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [getActiveProfileUseCase, getTransferBeneficiariesUseCase]);

  const onToggleAddPartyPress = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      showAddPartyForm: !currentState.showAddPartyForm,
      errorMessage: "",
    }));
  }, []);

  const onPartyNameChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      partyNameInput: value,
      errorMessage: "",
    }));
  }, []);

  const onBankNameChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      bankNameInput: value,
      errorMessage: "",
    }));
  }, []);

  const onAccountNumberChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      accountNumberInput: value,
      errorMessage: "",
    }));
  }, []);

  const onMobileNumberChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      mobileNumberInput: value,
      errorMessage: "",
    }));
  }, []);

  const onTransferMethodPress = useCallback((method: TransferMethod): void => {
    if (!TRANSFER_METHOD_OPTIONS.includes(method)) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      selectedTransferMethod: method,
      errorMessage: "",
    }));
  }, []);

  const onFavoriteTogglePress = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      markAsFavorite: !currentState.markAsFavorite,
      errorMessage: "",
    }));
  }, []);

  const onSavePartyPress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    const partyName = state.partyNameInput.trim();
    const bankName = state.bankNameInput.trim();
    const accountNumber = state.accountNumberInput.trim();
    const mobileNumber = state.mobileNumberInput.trim();

    if (!partyName || (!accountNumber && !mobileNumber)) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("parties.errors.invalidParty"),
      }));
      return;
    }

    isSubmittingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("parties.errors.noActiveProfile"),
        }));
        return;
      }

      const createResult = await createTransferBeneficiaryUseCase.execute({
        profileId: activeProfileResult.value.profileId,
        beneficiaryName: partyName,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        mobileNumber: mobileNumber || null,
        transferMethod: state.selectedTransferMethod,
        isFavorite: state.markAsFavorite,
      });

      if (!createResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("parties.errors.saveFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        partyNameInput: "",
        bankNameInput: "",
        accountNumberInput: "",
        mobileNumberInput: "",
        selectedTransferMethod: "other_bank",
        markAsFavorite: true,
        showAddPartyForm: false,
      }));

      await loadParties();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    createTransferBeneficiaryUseCase,
    getActiveProfileUseCase,
    loadParties,
    state.accountNumberInput,
    state.bankNameInput,
    state.markAsFavorite,
    state.mobileNumberInput,
    state.partyNameInput,
    state.selectedTransferMethod,
  ]);

  useEffect(() => {
    void loadParties();
  }, [loadParties]);

  return {
    state,
    onRefreshPress: loadParties,
    onToggleAddPartyPress,
    onPartyNameChange,
    onBankNameChange,
    onAccountNumberChange,
    onMobileNumberChange,
    onTransferMethodPress,
    onFavoriteTogglePress,
    onSavePartyPress,
  };
};
