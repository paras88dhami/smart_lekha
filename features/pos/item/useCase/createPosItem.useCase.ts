import type { Result } from "@/shared/types/result.types";
import type { CreatePosItemInput, PosItem } from "../types/types";

export interface CreatePosItemUseCase {
  execute(input: CreatePosItemInput): Promise<Result<PosItem>>;
}
