import type { GetProfilesByAccountIdUseCase } from "@/features/auth/profile/useCase/getProfilesByAccountId.useCase";
import type { Result } from "@/shared/types/result.types";
import type {
  ResolveVerifiedAccountRouteInput,
  ResolveVerifiedAccountRouteUseCase,
  VerifiedAccountDestination,
} from "./resolveVerifiedAccountRoute.useCase";

type Dependencies = {
  getProfilesByAccountIdUseCase: GetProfilesByAccountIdUseCase;
};

const createFailure = (message: string): Result<VerifiedAccountDestination> => {
  return { success: false, error: new Error(message) };
};

export const createResolveVerifiedAccountRouteUseCase = (
  dependencies: Dependencies,
): ResolveVerifiedAccountRouteUseCase => ({
  async execute(
    input: ResolveVerifiedAccountRouteInput,
  ): Promise<Result<VerifiedAccountDestination>> {
    const profilesResult = await dependencies.getProfilesByAccountIdUseCase.execute(
      input.accountId,
    );

    if (!profilesResult.success) {
      return createFailure(profilesResult.error.message);
    }

    if (profilesResult.value.length <= 0) {
      return { success: true, value: "create_profile" };
    }

    return { success: true, value: "profile_selection" };
  },
});
