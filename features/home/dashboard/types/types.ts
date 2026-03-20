import type { FinanceTransaction } from "@/features/finance/transaction/types/types";
import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";

export type HomeDashboardAccountOverview = {
  accountName: string;
  accountNumber: string;
  currencyCode: string;
  balance: number;
};

export type HomeDashboardFlowSummary = {
  todayInflow: number;
  todayOutflow: number;
};

export type HomeDashboardShortcut = {
  key: HomeShortcutKey;
  labelKey: string;
  iconName: string;
};

export type HomeDashboardRecentActivity = {
  id: string;
  title: string;
  occurredAt: number;
  amount: number;
  status: FinanceTransaction["status"];
  entryType: FinanceTransaction["entryType"];
};

export type HomeDashboardData = {
  profileName: string;
  accountOverview: HomeDashboardAccountOverview;
  flowSummary: HomeDashboardFlowSummary;
  shortcuts: HomeDashboardShortcut[];
  recentActivity: HomeDashboardRecentActivity[];
};
