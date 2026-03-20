import type { ActivateProfileContextUseCase } from "@/features/workspace/activeProfile/useCase/activateProfileContext.useCase";
import type { Result } from "@/shared/types/result.types";
import type { ActivateSelectedProfileUseCase } from "./activateSelectedProfile.useCase";

type Dependencies = {
  activateProfileContextUseCase: ActivateProfileContextUseCase;
};

const createFailure = (error: Error): Result<void> => {
  return { success: false, error };
};

export const createActivateSelectedProfileUseCase = (
  dependencies: Dependencies,
): ActivateSelectedProfileUseCase => ({
  async execute(profileId: string): Promise<Result<void>> {
    const result = await dependencies.activateProfileContextUseCase.execute(profileId);

    if (!result.success) {
      return createFailure(result.error);
    }

    return { success: true, value: undefined };
  },
});
