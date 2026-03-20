import type { Result } from "@/shared/types/result.types";

export type VerifiedAccountDestination =
  | "home"
  | "create_business"
  | "profile_selection";

export type ResolveVerifiedAccountRouteInput = {
  accountId: string;
};

export interface ResolveVerifiedAccountRouteUseCase {
  execute(
    input: ResolveVerifiedAccountRouteInput,
  ): Promise<Result<VerifiedAccountDestination>>;
}
