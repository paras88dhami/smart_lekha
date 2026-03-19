import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { AdjustFinanceAccountBalanceUseCase } from "@/features/finance/account/useCase/adjustFinanceAccountBalance.useCase";
import type { CreateFinanceTransactionUseCase } from "@/features/finance/transaction/useCase/createFinanceTransaction.useCase";
import type { CreateTransferBeneficiaryUseCase } from "@/features/transfers/beneficiary/useCase/createTransferBeneficiary.useCase";
import type { GetFavoriteTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getFavoriteTransferBeneficiaries.useCase";
import type { CreateTransferRecordUseCase, GetSavedTransfersUseCase } from "@/features/transfers/record/useCase/types";
import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import type { SendMoneyState, SendMoneyViewModel } from "./inventory.viewModel";

const TRANSFER_METHOD_OPTIONS: TransferMethod[] = [
  "same_bank",
  "other_bank",
  "connect_ips",
  "nepalpay_instant",
  "adbl_pay",
];

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  adjustFinanceAccountBalanceUseCase: AdjustFinanceAccountBalanceUseCase;
  createFinanceTransactionUseCase: CreateFinanceTransactionUseCase;
  getFavoriteTransferBeneficiariesUseCase: GetFavoriteTransferBeneficiariesUseCase;
  createTransferBeneficiaryUseCase: CreateTransferBeneficiaryUseCase;
  getSavedTransfersUseCase: GetSavedTransfersUseCase;
  createTransferRecordUseCase: CreateTransferRecordUseCase;
  onViewAllSavedPress: () => void;
};

export const useInventoryViewModel = (params: Params): SendMoneyViewModel => {
  const {
    getActiveProfileUseCase,
    ensureDefaultFinanceAccountsUseCase,
    getPrimaryFinanceAccountUseCase,
    adjustFinanceAccountBalanceUseCase,
    createFinanceTransactionUseCase,
    getFavoriteTransferBeneficiariesUseCase,
    createTransferBeneficiaryUseCase,
    getSavedTransfersUseCase,
    createTransferRecordUseCase,
    onViewAllSavedPress,
  } = params;

  const isLoadingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<SendMoneyState>({
    status: Status.Idle,
    selectedMethod: "same_bank",
    favorites: [],
    savedTransfers: [],
    showAddTransferForm: false,
    beneficiaryNameInput: "",
    accountNumberInput: "",
    mobileNumberInput: "",
    amountInput: "",
    noteInput: "",
    isScheduled: false,
    errorMessage: "",
  });

  const loadSendMoneyData = useCallback(async (): Promise<void> => {
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
          errorMessage: translate("sendMoney.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;
      const ensureAccountsResult = await ensureDefaultFinanceAccountsUseCase.execute(
        profileId,
      );

      if (!ensureAccountsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("sendMoney.errors.loadFailed"),
        }));
        return;
      }

      const [favoritesResult, savedTransfersResult] = await Promise.all([
        getFavoriteTransferBeneficiariesUseCase.execute(profileId),
        getSavedTransfersUseCase.execute(profileId, 20),
      ]);

      if (!favoritesResult.success || !savedTransfersResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("sendMoney.errors.loadFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        favorites: favoritesResult.value.map((beneficiary) => ({
          id: beneficiary.id,
          beneficiaryName: beneficiary.beneficiaryName,
          bankName: beneficiary.bankName,
          accountNumber: beneficiary.accountNumber,
          mobileNumber: beneficiary.mobileNumber,
          transferMethod: beneficiary.transferMethod,
        })),
        savedTransfers: savedTransfersResult.value.map((record) => ({
          id: record.id,
          beneficiaryId: record.beneficiaryId,
          amount: record.amount,
          note: record.note,
          recordType: record.recordType,
          status: record.status,
          createdAt: record.createdAt,
          scheduledFor: record.scheduledFor,
        })),
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    ensureDefaultFinanceAccountsUseCase,
    getActiveProfileUseCase,
    getFavoriteTransferBeneficiariesUseCase,
    getSavedTransfersUseCase,
  ]);

  const onMethodPress = useCallback((method: TransferMethod): void => {
    if (!TRANSFER_METHOD_OPTIONS.includes(method)) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      selectedMethod: method,
      errorMessage: "",
    }));
  }, []);

  const onToggleAddTransferPress = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      showAddTransferForm: !currentState.showAddTransferForm,
      errorMessage: "",
    }));
  }, []);

  const onBeneficiaryNameChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      beneficiaryNameInput: value,
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

  const onAmountChange = useCallback((value: string): void => {
    const sanitized = value.replace(/[^0-9.]/g, "");

    setState((currentState) => ({
      ...currentState,
      amountInput: sanitized,
      errorMessage: "",
    }));
  }, []);

  const onNoteChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      noteInput: value,
      errorMessage: "",
    }));
  }, []);

  const onScheduleTogglePress = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      isScheduled: !currentState.isScheduled,
      errorMessage: "",
    }));
  }, []);

  const onSubmitTransferPress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    const beneficiaryName = state.beneficiaryNameInput.trim();
    const accountNumber = state.accountNumberInput.trim();
    const mobileNumber = state.mobileNumberInput.trim();
    const parsedAmount = Number(state.amountInput);

    if (!beneficiaryName || (!accountNumber && !mobileNumber)) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("sendMoney.errors.invalidBeneficiary"),
      }));
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("sendMoney.errors.invalidAmount"),
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
          errorMessage: translate("sendMoney.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;
      const accountResult = await getPrimaryFinanceAccountUseCase.execute(profileId);

      if (!accountResult.success || !accountResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("sendMoney.errors.noPrimaryAccount"),
        }));
        return;
      }

      const beneficiaryResult = await createTransferBeneficiaryUseCase.execute({
        profileId,
        beneficiaryName,
        bankName: state.selectedMethod === "same_bank" ? "Same Bank" : "Other Bank",
        accountNumber: accountNumber || null,
        mobileNumber: mobileNumber || null,
        transferMethod: state.selectedMethod,
        isFavorite: true,
      });

      if (!beneficiaryResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("sendMoney.errors.saveFailed"),
        }));
        return;
      }

      const createRecordResult = await createTransferRecordUseCase.execute({
        profileId,
        beneficiaryId: beneficiaryResult.value.id,
        fromAccountId: accountResult.value.id,
        amount: parsedAmount,
        note: state.noteInput.trim() || null,
        recordType: state.isScheduled ? "scheduled" : "saved",
        scheduledFor: state.isScheduled ? Date.now() + 24 * 60 * 60 * 1000 : null,
        status: state.isScheduled ? "pending" : "completed",
      });

      if (!createRecordResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("sendMoney.errors.saveFailed"),
        }));
        return;
      }

      if (!state.isScheduled) {
        const transactionResult = await createFinanceTransactionUseCase.execute({
          profileId,
          accountId: accountResult.value.id,
          entryType: "transfer_out",
          categoryName: "Send Money",
          counterpartyName: beneficiaryName,
          note: state.noteInput.trim() || null,
          status: "success",
          amount: parsedAmount,
          occurredAt: Date.now(),
          referenceId: createRecordResult.value.id,
        });

        if (!transactionResult.success) {
          setState((currentState) => ({
            ...currentState,
            status: Status.Failure,
            errorMessage: translate("sendMoney.errors.saveFailed"),
          }));
          return;
        }

        const adjustBalanceResult = await adjustFinanceAccountBalanceUseCase.execute({
          accountId: accountResult.value.id,
          deltaAmount: -parsedAmount,
        });

        if (!adjustBalanceResult.success) {
          setState((currentState) => ({
            ...currentState,
            status: Status.Failure,
            errorMessage: translate("sendMoney.errors.saveFailed"),
          }));
          return;
        }
      }

      setState((currentState) => ({
        ...currentState,
        beneficiaryNameInput: "",
        accountNumberInput: "",
        mobileNumberInput: "",
        amountInput: "",
        noteInput: "",
        isScheduled: false,
        showAddTransferForm: false,
      }));

      await loadSendMoneyData();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    adjustFinanceAccountBalanceUseCase,
    createFinanceTransactionUseCase,
    createTransferBeneficiaryUseCase,
    createTransferRecordUseCase,
    getActiveProfileUseCase,
    getPrimaryFinanceAccountUseCase,
    loadSendMoneyData,
    state.amountInput,
    state.accountNumberInput,
    state.beneficiaryNameInput,
    state.isScheduled,
    state.mobileNumberInput,
    state.noteInput,
    state.selectedMethod,
  ]);

  useEffect(() => {
    void loadSendMoneyData();
  }, [loadSendMoneyData]);

  return {
    state,
    onRefreshPress: loadSendMoneyData,
    onMethodPress,
    onToggleAddTransferPress,
    onBeneficiaryNameChange,
    onAccountNumberChange,
    onMobileNumberChange,
    onAmountChange,
    onNoteChange,
    onScheduleTogglePress,
    onSubmitTransferPress,
    onViewAllSavedPress,
  };
};
