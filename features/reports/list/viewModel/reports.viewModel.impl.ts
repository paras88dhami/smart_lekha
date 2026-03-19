import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/types";
import type { GetSavedTransfersUseCase, GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/types";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { ReportsState, ReportsViewModel } from "./reports.viewModel";

const ENTRY_TYPE_LABEL_MAP: Record<
  | "income"
  | "expense"
  | "payment_in"
  | "payment_out"
  | "transfer_out"
  | "transfer_in"
  | "pos_sale",
  string
> = {
  income: "notifications.entryTypes.income",
  expense: "notifications.entryTypes.expense",
  payment_in: "notifications.entryTypes.paymentIn",
  payment_out: "notifications.entryTypes.paymentOut",
  transfer_out: "notifications.entryTypes.transferOut",
  transfer_in: "notifications.entryTypes.transferIn",
  pos_sale: "notifications.entryTypes.posSale",
};

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceSummaryUseCase: GetFinanceSummaryUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  getRecentPosSalesUseCase: GetRecentPosSalesUseCase;
  getSavedTransfersUseCase: GetSavedTransfersUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
};

export const useReportsViewModel = (params: Params): ReportsViewModel => {
  const {
    getActiveProfileUseCase,
    getFinanceSummaryUseCase,
    getFinanceTransactionsUseCase,
    getRecentPosSalesUseCase,
    getSavedTransfersUseCase,
    getScheduledTransfersUseCase,
  } = params;

  const isLoadingRef = useRef(false);

  const [state, setState] = useState<ReportsState>({
    status: Status.Idle,
    profileName: "",
    totalInflow: 0,
    totalOutflow: 0,
    currentNet: 0,
    todayInflow: 0,
    todayOutflow: 0,
    posSalesCount: 0,
    posSalesAmount: 0,
    savedTransfersCount: 0,
    scheduledTransfersCount: 0,
    entryTypeTotals: [],
    errorMessage: "",
  });

  const loadReports = useCallback(async (): Promise<void> => {
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
          errorMessage: translate("reports.errors.noActiveProfile"),
        }));
        return;
      }

      const profile = activeProfileResult.value;

      const [
        summaryResult,
        transactionsResult,
        posSalesResult,
        savedTransfersResult,
        scheduledTransfersResult,
      ] = await Promise.all([
        getFinanceSummaryUseCase.execute(profile.profileId),
        getFinanceTransactionsUseCase.execute(profile.profileId, 200),
        getRecentPosSalesUseCase.execute(profile.profileId, 100),
        getSavedTransfersUseCase.execute(profile.profileId, 100),
        getScheduledTransfersUseCase.execute(profile.profileId, 100),
      ]);

      if (
        !summaryResult.success ||
        !transactionsResult.success ||
        !posSalesResult.success ||
        !savedTransfersResult.success ||
        !scheduledTransfersResult.success
      ) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("reports.errors.loadFailed"),
        }));
        return;
      }

      const amountByEntryType = new Map<string, number>();

      for (const transaction of transactionsResult.value) {
        const currentAmount = amountByEntryType.get(transaction.entryType) ?? 0;
        amountByEntryType.set(transaction.entryType, currentAmount + transaction.amount);
      }

      const entryTypeTotals = Array.from(amountByEntryType.entries())
        .map(([entryType, amount]) => {
          const labelKey = ENTRY_TYPE_LABEL_MAP[entryType as keyof typeof ENTRY_TYPE_LABEL_MAP];

          return {
            label: translate(labelKey),
            amount,
          };
        })
        .sort((leftItem, rightItem) => rightItem.amount - leftItem.amount);

      const posSalesAmount = posSalesResult.value.reduce((sum, sale) => sum + sale.totalAmount, 0);

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        profileName: profile.profileName,
        totalInflow: summaryResult.value.totalInflow,
        totalOutflow: summaryResult.value.totalOutflow,
        currentNet: summaryResult.value.currentNet,
        todayInflow: summaryResult.value.todayInflow,
        todayOutflow: summaryResult.value.todayOutflow,
        posSalesCount: posSalesResult.value.length,
        posSalesAmount,
        savedTransfersCount: savedTransfersResult.value.length,
        scheduledTransfersCount: scheduledTransfersResult.value.length,
        entryTypeTotals,
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    getActiveProfileUseCase,
    getFinanceSummaryUseCase,
    getFinanceTransactionsUseCase,
    getRecentPosSalesUseCase,
    getSavedTransfersUseCase,
    getScheduledTransfersUseCase,
  ]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  return {
    state,
    onRefreshPress: loadReports,
  };
};
