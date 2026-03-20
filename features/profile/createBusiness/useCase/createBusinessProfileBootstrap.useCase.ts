import type { AuthResult } from "@/features/auth/shared/authError.types";

export type CreateBusinessProfileBootstrapInput = {
  accountId: string;
  profileName: string;
  businessCategoryId: string;
  businessCategoryName: string | null;
};

export interface CreateBusinessProfileBootstrapUseCase {
  execute(input: CreateBusinessProfileBootstrapInput): Promise<AuthResult<void>>;
}
