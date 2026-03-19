import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { BusinessCategory } from "../../types/types";

export interface BusinessCategoryRepository {
  getAllActiveBusinessCategories(): Promise<AuthResult<BusinessCategory[]>>;
}
