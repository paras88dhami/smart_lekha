import type { Result } from "@/shared/types/result.types";
import type { PosItem } from "../types/types";

export type GetPosItemsInput = {
  profileId: string;
};

export interface GetPosItemsUseCase {
  execute(input: GetPosItemsInput): Promise<Result<PosItem[]>>;
}
