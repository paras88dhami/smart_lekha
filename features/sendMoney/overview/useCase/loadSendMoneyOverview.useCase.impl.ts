import type { Result } from "@/shared/types/result.types";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetFavoriteTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getFavoriteTransferBeneficiaries.useCase";
import type { GetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase";
import type { GetSavedTransfersUseCase } from "@/features/transfers/record/useCase/getSavedTransfers.useCase";
import type { GetScheduledTransfersUseCase } from "@/features/transfers/record/useCase/getScheduledTransfers.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { createSendMoneyError } from "./sendMoneyError";
import {
  mapSendMoneyBeneficiaryItem,
  mapSendMoneyTransferItem,
} from "./sendMoneyData.mapper";
import type { LoadSendMoneyOverviewUseCase } from "./loadSendMoneyOverview.useCase";
import type { SendMoneyOverviewData } from "../types/types";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getTransferBeneficiariesUseCase: GetTransferBeneficiariesUseCase;
  getFavoriteTransferBeneficiariesUseCase: GetFavoriteTransferBeneficiariesUseCase;
  getSavedTransfersUseCase: GetSavedTransfersUseCase;
  getScheduledTransfersUseCase: GetScheduledTransfersUseCase;
};

const createFailure = (error: Error): Result<SendMoneyOverviewData> => {
  return { success: false, error };
};

export const createLoadSendMoneyOverviewUseCase = (
  dependencies: Dependencies,
): LoadSendMoneyOverviewUseCase => ({
  async execute(): Promise<Result<SendMoneyOverviewData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createSendMoneyError("no_active_profile"));
    }

    const profileId = activeProfileResult.value.profileId;
    const ensureAccountsResult = await dependencies.ensureDefaultFinanceAccountsUseCase.execute(
      profileId,
    );
    if (!ensureAccountsResult.success) {
      return createFailure(createSendMoneyError("load_failed"));
    }

    const [beneficiariesResult, favoritesResult, savedTransfersResult, scheduledTransfersResult] =
      await Promise.all([
        dependencies.getTransferBeneficiariesUseCase.execute(profileId),
        dependencies.getFavoriteTransferBeneficiariesUseCase.execute(profileId),
        dependencies.getSavedTransfersUseCase.execute(profileId, 20),
        dependencies.getScheduledTransfersUseCase.execute(profileId, 20),
      ]);

    if (
      !beneficiariesResult.success ||
      !favoritesResult.success ||
      !savedTransfersResult.success ||
      !scheduledTransfersResult.success
    ) {
      return createFailure(createSendMoneyError("load_failed"));
    }

    return {
      success: true,
      value: {
        beneficiaries: beneficiariesResult.value.map(mapSendMoneyBeneficiaryItem),
        favorites: favoritesResult.value.map(mapSendMoneyBeneficiaryItem),
        savedTransfers: savedTransfersResult.value.map(mapSendMoneyTransferItem),
        scheduledTransfers: scheduledTransfersResult.value.map(mapSendMoneyTransferItem),
      },
    };
  },
});
