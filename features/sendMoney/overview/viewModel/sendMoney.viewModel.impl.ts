import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import type { SendMoneyViewModel } from "./sendMoney.viewModel";
import type { LoadSendMoneyOverviewUseCase } from "../useCase/loadSendMoneyOverview.useCase";
import type { SubmitSendMoneyTransferUseCase } from "../useCase/submitSendMoneyTransfer.useCase";
import { getSendMoneyErrorMessage } from "./sendMoneyErrorMessage";
import {
  changeSendMoneyAccountNumber,
  changeSendMoneyAmount,
  changeSendMoneyBeneficiaryName,
  changeSendMoneyMobileNumber,
  changeSendMoneyNote,
  selectSendMoneyMethod,
  toggleSendMoneyForm,
  toggleSendMoneySchedule,
} from "./sendMoneyFormActions";
import {
  createFailureSendMoneyState,
  createInitialSendMoneyState,
  createLoadingSendMoneyState,
  createSendMoneyFormState,
  createSuccessSendMoneyState,
} from "./sendMoneyState";

type Dependencies = {
  loadSendMoneyOverviewUseCase: LoadSendMoneyOverviewUseCase;
  submitSendMoneyTransferUseCase: SubmitSendMoneyTransferUseCase;
  onViewAllSavedPress: () => void;
};

export const useSendMoneyViewModel = (dependencies: Dependencies): SendMoneyViewModel => {
  const [state, setState] = useState(createInitialSendMoneyState);
  const isLoadingReference = useRef<boolean>(false);
  const isSubmittingReference = useRef<boolean>(false);

  const loadOverview = useCallback(async (): Promise<void> => {
    if (isLoadingReference.current) {
      return;
    }

    isLoadingReference.current = true;
    setState(createLoadingSendMoneyState);

    try {
      const result = await dependencies.loadSendMoneyOverviewUseCase.execute();
      if (!result.success) {
        setState((currentState) =>
          createFailureSendMoneyState(currentState, getSendMoneyErrorMessage(result.error)),
        );
        return;
      }

      setState((currentState) => createSuccessSendMoneyState(currentState, result.value));
    } finally {
      isLoadingReference.current = false;
    }
  }, [dependencies.loadSendMoneyOverviewUseCase]);

  const onMethodPress = useCallback((method: TransferMethod): void => {
    setState((currentState) => selectSendMoneyMethod(currentState, method));
  }, []);

  const onToggleAddTransferPress = useCallback((): void => {
    setState(toggleSendMoneyForm);
  }, []);

  const onBeneficiaryNameChange = useCallback((value: string): void => {
    setState((currentState) => changeSendMoneyBeneficiaryName(currentState, value));
  }, []);

  const onAccountNumberChange = useCallback((value: string): void => {
    setState((currentState) => changeSendMoneyAccountNumber(currentState, value));
  }, []);

  const onMobileNumberChange = useCallback((value: string): void => {
    setState((currentState) => changeSendMoneyMobileNumber(currentState, value));
  }, []);

  const onAmountChange = useCallback((value: string): void => {
    setState((currentState) => changeSendMoneyAmount(currentState, value));
  }, []);

  const onNoteChange = useCallback((value: string): void => {
    setState((currentState) => changeSendMoneyNote(currentState, value));
  }, []);

  const onScheduleTogglePress = useCallback((): void => {
    setState(toggleSendMoneySchedule);
  }, []);

  const onSubmitTransferPress = useCallback(async (): Promise<void> => {
    if (isSubmittingReference.current) {
      return;
    }

    isSubmittingReference.current = true;
    setState(createLoadingSendMoneyState);

    try {
      const result = await dependencies.submitSendMoneyTransferUseCase.execute({
        selectedMethod: state.selectedMethod,
        ...state.form,
      });
      if (!result.success) {
        setState((currentState) =>
          createFailureSendMoneyState(currentState, getSendMoneyErrorMessage(result.error)),
        );
        return;
      }

      setState((currentState) => ({
        ...currentState,
        showAddTransferForm: false,
        form: createSendMoneyFormState(),
      }));
      await loadOverview();
    } finally {
      isSubmittingReference.current = false;
    }
  }, [dependencies.submitSendMoneyTransferUseCase, loadOverview, state.form, state.selectedMethod]);

  useEffect((): void => {
    void loadOverview();
  }, [loadOverview]);

  return useMemo<SendMoneyViewModel>(() => {
    return {
      state,
      onRefreshPress: loadOverview,
      onMethodPress,
      onToggleAddTransferPress,
      onBeneficiaryNameChange,
      onAccountNumberChange,
      onMobileNumberChange,
      onAmountChange,
      onNoteChange,
      onScheduleTogglePress,
      onSubmitTransferPress,
      onViewAllSavedPress: dependencies.onViewAllSavedPress,
    };
  }, [
    dependencies.onViewAllSavedPress,
    loadOverview,
    onAccountNumberChange,
    onAmountChange,
    onBeneficiaryNameChange,
    onMethodPress,
    onMobileNumberChange,
    onNoteChange,
    onScheduleTogglePress,
    onSubmitTransferPress,
    onToggleAddTransferPress,
    state,
  ]);
};
