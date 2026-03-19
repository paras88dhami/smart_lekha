import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { CreateFinanceAccountUseCase } from "@/features/finance/account/useCase/createFinanceAccount.useCase";
import type { SetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/setPrimaryFinanceAccount.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import type { CashBankState, CashBankViewModel } from "./cashBank.viewModel";

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  createFinanceAccountUseCase: CreateFinanceAccountUseCase;
  setPrimaryFinanceAccountUseCase: SetPrimaryFinanceAccountUseCase;
};

const ACCOUNT_TYPES: FinanceAccountType[] = ["cash", "bank", "wallet"];

export const useCashBankViewModel = (params: Params): CashBankViewModel => {
  const {
    getActiveProfileUseCase,
    ensureDefaultFinanceAccountsUseCase,
    getFinanceAccountsByProfileUseCase,
    createFinanceAccountUseCase,
    setPrimaryFinanceAccountUseCase,
  } = params;

  const isLoadingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const [state, setState] = useState<CashBankState>({
    status: Status.Idle,
    profileName: "",
    accounts: [],
    showAddAccountForm: false,
    accountNameInput: "",
    accountNumberInput: "",
    openingBalanceInput: "",
    selectedAccountType: "cash",
    errorMessage: "",
  });

  const loadAccounts = useCallback(async (): Promise<void> => {
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
          errorMessage: translate("cashBank.errors.noActiveProfile"),
        }));
        return;
      }

      const profile = activeProfileResult.value;

      const ensureAccountsResult = await ensureDefaultFinanceAccountsUseCase.execute(
        profile.profileId,
      );

      if (!ensureAccountsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("cashBank.errors.loadFailed"),
        }));
        return;
      }

      const accountsResult = await getFinanceAccountsByProfileUseCase.execute(
        profile.profileId,
      );

      if (!accountsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("cashBank.errors.loadFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        profileName: profile.profileName,
        accounts: accountsResult.value.map((account) => ({
          id: account.id,
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          currencyCode: account.currencyCode,
          currentBalance: account.currentBalance,
          isPrimary: account.isPrimary,
        })),
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    ensureDefaultFinanceAccountsUseCase,
    getActiveProfileUseCase,
    getFinanceAccountsByProfileUseCase,
  ]);

  const onToggleAddAccountPress = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      showAddAccountForm: !currentState.showAddAccountForm,
      errorMessage: "",
    }));
  }, []);

  const onAccountNameChange = useCallback((value: string): void => {
    setState((currentState) => ({
      ...currentState,
      accountNameInput: value,
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

  const onOpeningBalanceChange = useCallback((value: string): void => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    setState((currentState) => ({
      ...currentState,
      openingBalanceInput: sanitizedValue,
      errorMessage: "",
    }));
  }, []);

  const onAccountTypePress = useCallback((accountType: FinanceAccountType): void => {
    if (!ACCOUNT_TYPES.includes(accountType)) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      selectedAccountType: accountType,
      errorMessage: "",
    }));
  }, []);

  const onCreateAccountPress = useCallback(async (): Promise<void> => {
    if (isSubmittingRef.current) {
      return;
    }

    const accountName = state.accountNameInput.trim();
    const accountNumber = state.accountNumberInput.trim();
    const openingBalance = Number(state.openingBalanceInput || "0");

    if (accountName.length < 2) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("cashBank.errors.invalidName"),
      }));
      return;
    }

    if (!Number.isFinite(openingBalance) || openingBalance < 0) {
      setState((currentState) => ({
        ...currentState,
        status: Status.Failure,
        errorMessage: translate("cashBank.errors.invalidOpeningBalance"),
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
          errorMessage: translate("cashBank.errors.noActiveProfile"),
        }));
        return;
      }

      const hasPrimary = state.accounts.some((account) => account.isPrimary);

      const createResult = await createFinanceAccountUseCase.execute({
        profileId: activeProfileResult.value.profileId,
        accountName,
        accountNumber: accountNumber || null,
        accountType: state.selectedAccountType,
        isPrimary: !hasPrimary,
        currencyCode: "NPR",
        currentBalance: openingBalance,
      });

      if (!createResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("cashBank.errors.createFailed"),
        }));
        return;
      }

      setState((currentState) => ({
        ...currentState,
        accountNameInput: "",
        accountNumberInput: "",
        openingBalanceInput: "",
        selectedAccountType: "cash",
        showAddAccountForm: false,
      }));

      await loadAccounts();
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    createFinanceAccountUseCase,
    getActiveProfileUseCase,
    loadAccounts,
    state.accountNameInput,
    state.accountNumberInput,
    state.accounts,
    state.openingBalanceInput,
    state.selectedAccountType,
  ]);

  const onSetPrimaryPress = useCallback(
    async (accountId: string): Promise<void> => {
      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;

      setState((currentState) => ({
        ...currentState,
        status: Status.Loading,
        errorMessage: "",
      }));

      try {
        const setPrimaryResult = await setPrimaryFinanceAccountUseCase.execute(
          accountId,
        );

        if (!setPrimaryResult.success) {
          setState((currentState) => ({
            ...currentState,
            status: Status.Failure,
            errorMessage: translate("cashBank.errors.setPrimaryFailed"),
          }));
          return;
        }

        await loadAccounts();
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [loadAccounts, setPrimaryFinanceAccountUseCase],
  );

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  return {
    state,
    onRefreshPress: loadAccounts,
    onToggleAddAccountPress,
    onAccountNameChange,
    onAccountNumberChange,
    onOpeningBalanceChange,
    onAccountTypePress,
    onCreateAccountPress,
    onSetPrimaryPress,
  };
};
