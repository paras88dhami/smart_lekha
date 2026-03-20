import type { FinanceAccount } from "@/features/finance/account/types/types";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type {
  FinanceSummary,
  FinanceTransaction,
} from "@/features/finance/transaction/types/types";
import type { GetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase";
import type { GetRecentFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getRecentFinanceTransactions.useCase";
import type { HomeShortcut } from "@/features/home/shortcut/types/types";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { GetHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getHomeShortcuts.useCase";
import type { ActiveProfile } from "@/features/workspace/activeProfile/types/types";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type { Result } from "@/shared/types/result.types";
import type { HomeDashboardError } from "./homeDashboardError";

export type LoadHomeDashboardParams = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getHomeShortcutsUseCase: GetHomeShortcutsUseCase;
  getRecentFinanceTransactionsUseCase: GetRecentFinanceTransactionsUseCase;
  getFinanceSummaryUseCase: GetFinanceSummaryUseCase;
};

export type HomeDashboardSourceData = {
  primaryAccount: FinanceAccount | null;
  shortcuts: HomeShortcut[];
  recentTransactions: FinanceTransaction[];
  summary: FinanceSummary;
};

export const createHomeDashboardFailureResult = <T>(
  error: HomeDashboardError,
): Result<T, HomeDashboardError> => {
  return {
    success: false,
    error,
  };
};

export const loadHomeDashboardActiveProfile = async (
  getActiveProfileUseCase: GetActiveProfileUseCase,
): Promise<Result<ActiveProfile, HomeDashboardError>> => {
  const activeProfileResult = await getActiveProfileUseCase.execute();

  if (!activeProfileResult.success || !activeProfileResult.value) {
    return createHomeDashboardFailureResult<ActiveProfile>("no_active_profile");
  }

  return {
    success: true,
    value: activeProfileResult.value,
  };
};

export const ensureHomeDashboardData = async (
  profileId: string,
  params: LoadHomeDashboardParams,
): Promise<Result<void, HomeDashboardError>> => {
  const ensureAccountsResult = await params.ensureDefaultFinanceAccountsUseCase.execute(
    profileId,
  );

  if (!ensureAccountsResult.success) {
    return createHomeDashboardFailureResult<void>("accounts_load_failed");
  }

  const ensureShortcutsResult = await params.ensureDefaultHomeShortcutsUseCase.execute(
    profileId,
  );

  if (!ensureShortcutsResult.success) {
    return createHomeDashboardFailureResult<void>("shortcuts_load_failed");
  }

  return {
    success: true,
    value: undefined,
  };
};

export const loadHomeDashboardSourceData = async (
  profileId: string,
  params: LoadHomeDashboardParams,
): Promise<Result<HomeDashboardSourceData, HomeDashboardError>> => {
  const [
    primaryAccountResult,
    shortcutsResult,
    recentTransactionsResult,
    financeSummaryResult,
  ] = await Promise.all([
    params.getPrimaryFinanceAccountUseCase.execute(profileId),
    params.getHomeShortcutsUseCase.execute(profileId),
    params.getRecentFinanceTransactionsUseCase.execute(profileId, 8),
    params.getFinanceSummaryUseCase.execute(profileId),
  ]);

  if (
    !primaryAccountResult.success ||
    !shortcutsResult.success ||
    !recentTransactionsResult.success ||
    !financeSummaryResult.success
  ) {
    return createHomeDashboardFailureResult<HomeDashboardSourceData>(
      "dashboard_load_failed",
    );
  }

  return {
    success: true,
    value: {
      primaryAccount: primaryAccountResult.value,
      shortcuts: shortcutsResult.value,
      recentTransactions: recentTransactionsResult.value,
      summary: financeSummaryResult.value,
    },
  };
};
