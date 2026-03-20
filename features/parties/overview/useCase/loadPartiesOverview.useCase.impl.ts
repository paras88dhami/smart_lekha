import type { Result } from "@/shared/types/result.types";
import type { GetTransferBeneficiariesUseCase } from "@/features/transfers/beneficiary/useCase/getTransferBeneficiaries.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import { mapPartyItem } from "./partiesData.mapper";
import { createPartiesError } from "./partiesError";
import type { LoadPartiesOverviewUseCase } from "./loadPartiesOverview.useCase";
import type { PartiesOverviewData } from "../types/types";

type Dependencies = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  getTransferBeneficiariesUseCase: GetTransferBeneficiariesUseCase;
};

const createFailure = (error: Error): Result<PartiesOverviewData> => {
  return { success: false, error };
};

export const createLoadPartiesOverviewUseCase = (
  dependencies: Dependencies,
): LoadPartiesOverviewUseCase => ({
  async execute(): Promise<Result<PartiesOverviewData>> {
    const activeProfileResult = await dependencies.getActiveProfileUseCase.execute();
    if (!activeProfileResult.success || !activeProfileResult.value) {
      return createFailure(createPartiesError("no_active_profile"));
    }

    const partiesResult = await dependencies.getTransferBeneficiariesUseCase.execute(
      activeProfileResult.value.profileId,
    );
    if (!partiesResult.success) {
      return createFailure(createPartiesError("load_failed"));
    }

    return {
      success: true,
      value: {
        profileName: activeProfileResult.value.profileName,
        parties: partiesResult.value.map(mapPartyItem),
      },
    };
  },
});
