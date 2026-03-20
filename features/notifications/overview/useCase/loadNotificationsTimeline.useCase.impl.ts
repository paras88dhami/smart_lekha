import type { Result } from "@/shared/types/result.types";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import {
  mapScheduledTransferNotification,
  mapTransactionNotification,
} from "./notificationsData.mapper";
import { createNotificationsError } from "./notificationsError";
import type { LoadNotificationsTimelineUseCase } from "./loadNotificationsTimeline.useCase";
import type { NotificationsOverviewData } from "../types/types";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
};

const createFailure = (error: Error): Result<NotificationsOverviewData> => {
  return { success: false, error };
};

export const createLoadNotificationsTimelineUseCase = (
  dependencies: Dependencies,
): LoadNotificationsTimelineUseCase => ({
  async execute(): Promise<Result<NotificationsOverviewData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createNotificationsError("no_active_profile"));
    }

    const [transactionsResult, scheduledTransfersResult] = await Promise.all([
      dependencies.getFinanceTransactionsUseCase.execute(activeProfileResult.value.profileId, 40),
      dependencies.getScheduledTransfersUseCase.execute(activeProfileResult.value.profileId, 20),
    ]);
    if (!transactionsResult.success || !scheduledTransfersResult.success) {
      return createFailure(createNotificationsError("load_failed"));
    }

    const notifications = [
      ...transactionsResult.value.map(mapTransactionNotification),
      ...scheduledTransfersResult.value.map(mapScheduledTransferNotification),
    ].sort((leftItem, rightItem) => rightItem.timestamp - leftItem.timestamp);

    return { success: true, value: { notifications } };
  },
});
