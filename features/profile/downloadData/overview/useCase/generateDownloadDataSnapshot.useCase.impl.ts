import type { Result } from "@/shared/types/result.types";
import type { GetFinanceAccountsByProfileUseCase } from "@/features/finance/account/useCase/getFinanceAccountsByProfile.useCase";
import type { GetFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getFinanceTransactions.useCase";
import type { GetPosItemsUseCase } from "@/features/pos/item/useCase/getPosItems.useCase";
import type { GetRecentPosSalesUseCase } from "@/features/pos/sale/useCase/getRecentPosSales.useCase";
import type { GetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase";
import type { GetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase";
import type { GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { buildDownloadDataSnapshot } from "./downloadData.mapper";
import { createDownloadDataError } from "./downloadDataError";
import type { GenerateDownloadDataSnapshotUseCase } from "./generateDownloadDataSnapshot.useCase";
import type { DownloadDataSnapshot } from "../types/types";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getFinanceAccountsByProfileUseCase: GetFinanceAccountsByProfileUseCase;
  getFinanceTransactionsUseCase: GetFinanceTransactionsUseCase;
  getTransferBeneficiariesUseCase: GetTransferBeneficiariesUseCase;
  getSavedTransfersUseCase: GetSavedTransfersUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
  getPosItemsUseCase: GetPosItemsUseCase;
  getRecentPosSalesUseCase: GetRecentPosSalesUseCase;
};

const createFailure = (error: Error): Result<DownloadDataSnapshot> => {
  return { success: false, error };
};

export const createGenerateDownloadDataSnapshotUseCase = (
  dependencies: Dependencies,
): GenerateDownloadDataSnapshotUseCase => ({
  async execute(): Promise<Result<DownloadDataSnapshot>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createDownloadDataError("no_active_profile"));
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
      dependencies.getFinanceAccountsByProfileUseCase.execute(profile.profileId),
      dependencies.getFinanceTransactionsUseCase.execute(profile.profileId, 200),
      dependencies.getTransferBeneficiariesUseCase.execute(profile.profileId),
      dependencies.getSavedTransfersUseCase.execute(profile.profileId, 100),
      dependencies.getScheduledTransfersUseCase.execute(profile.profileId, 100),
      dependencies.getPosItemsUseCase.execute({ profileId: profile.profileId }),
      dependencies.getRecentPosSalesUseCase.execute(profile.profileId, 100),
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
      return createFailure(createDownloadDataError("generate_failed"));
    }

    return {
      success: true,
      value: buildDownloadDataSnapshot({
        profile,
        accounts: accountsResult.value,
        transactions: transactionsResult.value,
        beneficiaries: beneficiariesResult.value,
        savedTransfers: savedTransfersResult.value,
        scheduledTransfers: scheduledTransfersResult.value,
        posItems: posItemsResult.value,
        posSales: posSalesResult.value,
      }),
    };
  },
});
