import type { Result } from "@/shared/types/result.types";
import type { CreatePosSaleInput, PosSale } from "../types/types";

export interface CreatePosSaleUseCase {
  execute(input: CreatePosSaleInput): Promise<Result<PosSale>>;
}
