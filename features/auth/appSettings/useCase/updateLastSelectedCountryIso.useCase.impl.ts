import type { AuthResult } from "@/features/auth/shared/authError.types";
import type { AppSettingRepository } from "../data/repository/appSetting.repository";
import type { UpdateLastSelectedCountryInput } from "../types/types";
import type { UpdateLastSelectedCountryIsoUseCase } from "./updateLastSelectedCountryIso.useCase";

export const createUpdateLastSelectedCountryIsoUseCase = (
  repository: AppSettingRepository,
): UpdateLastSelectedCountryIsoUseCase => ({
  async execute(
    input: UpdateLastSelectedCountryInput,
  ): Promise<AuthResult<void>> {
    return repository.updateLastSelectedCountryIso(input.countryIso);
  },
});
