import type { AuthResult } from "../../shared/authError.types";
import type { ProfileModel } from "../data/dataSource/profile.model";

export interface GetProfilesByAccountIdUseCase {
  execute(accountId: string): Promise<AuthResult<ProfileModel[]>>;
}
