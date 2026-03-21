import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";
import type { StatusType } from "@/shared/types/status.types";
import type {
  HomeDashboardAccountOverview,
  HomeDashboardFlowSummary,
  HomeDashboardPaymentSummary,
  HomeDashboardRecentActivity,
  HomeDashboardShortcut,
} from "../types/types";

export type HomeDashboardState = {
  status: StatusType;
  greeting: string;
  profileName: string;
  accountOverview: HomeDashboardAccountOverview;
  flowSummary: HomeDashboardFlowSummary;
  paymentSummary: HomeDashboardPaymentSummary;
  shortcuts: HomeDashboardShortcut[];
  recentActivity: HomeDashboardRecentActivity[];
  errorMessage: string;
};

export interface HomeDashboardViewModel {
  state: HomeDashboardState;
  onRefreshPress(): Promise<void>;
  onShortcutPress(shortcutKey: HomeShortcutKey): void;
  onEditShortcutsPress(): void;
  onViewAllTransactionsPress(): void;
  onNotificationsPress(): void;
  onProfilePress(): void;
}
