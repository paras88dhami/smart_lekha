import type { Result } from "@/shared/types/result.types";
import type { ActiveProfileRepository } from "./activeProfile.repository";
import type { ActiveProfileDataSource } from "../dataSource/activeProfile.dataSource";
import type { ActiveProfile } from "../../types/types";

export const createActiveProfileRepository = (
  localDataSource: ActiveProfileDataSource,
): ActiveProfileRepository => ({
  async getActiveProfile(): Promise<Result<ActiveProfile | null>> {
    return localDataSource.getActiveProfile();
  },
});
