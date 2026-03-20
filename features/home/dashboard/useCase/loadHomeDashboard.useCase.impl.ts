import type { Result } from "@/shared/types/result.types";
import type { HomeDashboardData } from "../types/types";
import { createHomeDashboardData } from "./homeDashboardData.mapper";
import type { HomeDashboardError } from "./homeDashboardError";
import {
  ensureHomeDashboardData,
  loadHomeDashboardActiveProfile,
  loadHomeDashboardSourceData,
} from "./loadHomeDashboard.helpers";
import type {
  LoadHomeDashboardParams,
} from "./loadHomeDashboard.helpers";
import type { LoadHomeDashboardUseCase } from "./loadHomeDashboard.useCase";

export const createLoadHomeDashboardUseCase = (
  params: LoadHomeDashboardParams,
): LoadHomeDashboardUseCase => ({
  async execute(): Promise<Result<HomeDashboardData, HomeDashboardError>> {
    const activeProfileResult = await loadHomeDashboardActiveProfile(
      params.getActiveProfileUseCase,
    );

    if (!activeProfileResult.success) {
      return activeProfileResult;
    }

    const ensureDataResult = await ensureHomeDashboardData(
      activeProfileResult.value.profileId,
      params,
    );

    if (!ensureDataResult.success) {
      return ensureDataResult;
    }

    const dashboardSourceResult = await loadHomeDashboardSourceData(
      activeProfileResult.value.profileId,
      params,
    );

    if (!dashboardSourceResult.success) {
      return dashboardSourceResult;
    }

    return {
      success: true,
      value: createHomeDashboardData(
        activeProfileResult.value,
        dashboardSourceResult.value,
      ),
    };
  },
});
