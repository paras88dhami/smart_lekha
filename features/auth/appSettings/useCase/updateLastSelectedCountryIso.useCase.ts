import type { AuthResult } from "../../shared/authError.types";
import type { UpdateLastSelectedCountryInput } from "../types/types";

export interface UpdateLastSelectedCountryIsoUseCase {
  execute(input: UpdateLastSelectedCountryInput): Promise<AuthResult<void>>;
}
