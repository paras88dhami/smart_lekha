import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetPosItemsUseCase } from "@/features/pos/item/useCase/getPosItems.useCase";
import type { GetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/types";
import type { GetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase";
import type { GetSavedTransfersUseCase, GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/types";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { DownloadDataState, DownloadDataViewModel } from "./downloadData.viewModel";

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  getTransferBeneficiariesUseCase: GetTransferBeneficiariesUseCase;
  getSavedTransfersUseCase: GetSavedTransfersUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
  getPosItemsUseCase: GetPosItemsUseCase;
  getRecentPosSalesUseCase: GetRecentPosSalesUseCase;
};

export const useDownloadDataViewModel = (
  params: Params,
): DownloadDataViewModel => {
  const {
    getActiveProfileUseCase,
    getFinanceAccountsByProfileUseCase,
    getFinanceTransactionsUseCase,
    getTransferBeneficiariesUseCase,
    getSavedTransfersUseCase,
    getScheduledTransfersUseCase,
    getPosItemsUseCase,
    getRecentPosSalesUseCase,
  } = params;

  const isLoadingRef = useRef(false);

  const [state, setState] = useState<DownloadDataState>({
    status: Status.Idle,
    profileName: "",
    generatedAt: null,
    summary: {
      accountsCount: 0,
      transactionsCount: 0,
      beneficiariesCount: 0,
      savedTransfersCount: 0,
      scheduledTransfersCount: 0,
      posItemsCount: 0,
      posSalesCount: 0,
    },
    jsonPreview: "",
    errorMessage: "",
  });

  const generateDataSnapshot = useCallback(async (): Promise<void> => {
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
          errorMessage: translate("profile.downloadData.errors.noActiveProfile"),
        }));
        return;
      }

      const profile = activeProfileResult.value;

      const [
        accountsResult,
        transactionsResult,
        beneficiariesResult,
        savedTransfersResult,
        scheduledTransfersResult,
        posItemsResult,
        posSalesResult,
      ] = await Promise.all([
        getFinanceAccountsByProfileUseCase.execute(profile.profileId),
        getFinanceTransactionsUseCase.execute(profile.profileId, 200),
        getTransferBeneficiariesUseCase.execute(profile.profileId),
        getSavedTransfersUseCase.execute(profile.profileId, 100),
        getScheduledTransfersUseCase.execute(profile.profileId, 100),
        getPosItemsUseCase.execute({ profileId: profile.profileId }),
        getRecentPosSalesUseCase.execute(profile.profileId, 100),
      ]);

      if (
        !accountsResult.success ||
        !transactionsResult.success ||
        !beneficiariesResult.success ||
        !savedTransfersResult.success ||
        !scheduledTransfersResult.success ||
        !posItemsResult.success ||
        !posSalesResult.success
      ) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("profile.downloadData.errors.generateFailed"),
        }));
        return;
      }

      const generatedAt = Date.now();
      const summary = {
        accountsCount: accountsResult.value.length,
        transactionsCount: transactionsResult.value.length,
        beneficiariesCount: beneficiariesResult.value.length,
        savedTransfersCount: savedTransfersResult.value.length,
        scheduledTransfersCount: scheduledTransfersResult.value.length,
        posItemsCount: posItemsResult.value.length,
        posSalesCount: posSalesResult.value.length,
      };

      const exportPayload = {
        meta: {
          generatedAt,
          profileId: profile.profileId,
          profileName: profile.profileName,
          profileType: profile.profileType,
        },
        summary,
        accounts: accountsResult.value,
        transactions: transactionsResult.value,
        beneficiaries: beneficiariesResult.value,
        savedTransfers: savedTransfersResult.value,
        scheduledTransfers: scheduledTransfersResult.value,
        posItems: posItemsResult.value,
        posSales: posSalesResult.value,
      };

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        profileName: profile.profileName,
        generatedAt,
        summary,
        jsonPreview: JSON.stringify(exportPayload, null, 2),
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    getActiveProfileUseCase,
    getFinanceAccountsByProfileUseCase,
    getFinanceTransactionsUseCase,
    getPosItemsUseCase,
    getRecentPosSalesUseCase,
    getSavedTransfersUseCase,
    getScheduledTransfersUseCase,
    getTransferBeneficiariesUseCase,
  ]);

  useEffect(() => {
    void generateDataSnapshot();
  }, [generateDataSnapshot]);

  return {
    state,
    onRefreshPress: generateDataSnapshot,
    onGeneratePress: generateDataSnapshot,
  };
};
