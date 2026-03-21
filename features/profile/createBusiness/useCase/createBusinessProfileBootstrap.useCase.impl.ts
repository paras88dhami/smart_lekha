import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { CreateProfileWithContextUseCase } from "@/features/auth/profile/useCase/createProfileWithContext.useCase";
import type {
  CreateBusinessProfileBootstrapInput,
  CreateBusinessProfileBootstrapUseCase,
} from "./createBusinessProfileBootstrap.useCase";

type Dependencies = {
  createProfileWithContextUseCase: CreateProfileWithContextUseCase;
};

export const createCreateBusinessProfileBootstrapUseCase = (
  dependencies: Dependencies,
): CreateBusinessProfileBootstrapUseCase => ({
  async execute(
    input: CreateBusinessProfileBootstrapInput,
  ): Promise<AuthResult<void>> {
    const profileResult = await dependencies.createProfileWithContextUseCase.execute({
      accountId: input.accountId,
      profileType: "business",
      profileName: input.profileName,
      displayName: input.profileName,
      roleName: "Owner",
      businessCategoryId: input.businessCategoryId,
      businessCategoryName: input.businessCategoryName,
      isActive: true,
    });

    if (!profileResult.success) {
      return profileResult;
    }

    return { success: true, value: undefined };
  },
});
