import type { AuthResult } from "../../shared/authError.types";
import type { BusinessCategory } from "../types/types";

export interface GetActiveBusinessCategoriesUseCase {
  execute(): Promise<AuthResult<BusinessCategory[]>>;
}
