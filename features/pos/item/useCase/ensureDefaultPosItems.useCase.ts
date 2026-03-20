import type { Result } from "@/shared/types/result.types";

export type EnsureDefaultPosItemsInput = {
  profileId: string;
};

export interface EnsureDefaultPosItemsUseCase {
  execute(input: EnsureDefaultPosItemsInput): Promise<Result<void>>;
}
