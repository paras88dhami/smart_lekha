import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { NotificationsState, NotificationsViewModel } from "./notifications.viewModel";

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
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
};

export const useNotificationsViewModel = (
  params: Params,
): NotificationsViewModel => {
  const {
    getActiveProfileUseCase,
    getFinanceTransactionsUseCase,
    getScheduledTransfersUseCase,
  } = params;

  const isLoadingRef = useRef(false);

  const [state, setState] = useState<NotificationsState>({
    status: Status.Idle,
    notifications: [],
    errorMessage: "",
  });

  const loadNotifications = useCallback(async (): Promise<void> => {
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
          errorMessage: translate("notifications.errors.noActiveProfile"),
        }));
        return;
      }

      const profileId = activeProfileResult.value.profileId;

      const [transactionsResult, scheduledTransfersResult] = await Promise.all([
        getFinanceTransactionsUseCase.execute(profileId, 40),
        getScheduledTransfersUseCase.execute(profileId, 20),
      ]);

      if (!transactionsResult.success || !scheduledTransfersResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("notifications.errors.loadFailed"),
        }));
        return;
      }

      const transactionNotifications = transactionsResult.value.map((transaction) => {
        const entryTypeLabel = translate(ENTRY_TYPE_LABEL_MAP[transaction.entryType]);

        return {
          id: `txn-${transaction.id}`,
          title: entryTypeLabel,
          description:
            transaction.note?.trim() ||
            transaction.counterpartyName?.trim() ||
            transaction.categoryName?.trim() ||
            translate("notifications.defaultTransactionDescription"),
          timestamp: transaction.occurredAt,
          kind: "transaction" as const,
        };
      });

      const transferNotifications = scheduledTransfersResult.value.map((record) => {
        const transferTimestamp = record.scheduledFor ?? record.createdAt;

        return {
          id: `scheduled-${record.id}`,
          title: translate("notifications.scheduledTransferTitle"),
          description: record.note?.trim() || translate("notifications.scheduledTransferDescription"),
          timestamp: transferTimestamp,
          kind: "scheduled_transfer" as const,
        };
      });

      const mergedNotifications = [...transactionNotifications, ...transferNotifications].sort(
        (leftItem, rightItem) => rightItem.timestamp - leftItem.timestamp,
      );

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        notifications: mergedNotifications,
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    getActiveProfileUseCase,
    getFinanceTransactionsUseCase,
    getScheduledTransfersUseCase,
  ]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  return {
    state,
    onRefreshPress: loadNotifications,
  };
};
