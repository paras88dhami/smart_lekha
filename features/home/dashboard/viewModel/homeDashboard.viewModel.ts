import type { StatusType } from "@/shared/types/status.types";
import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";
import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";

export type HomeDashboardShortcutItem = {
  key: HomeShortcutKey;
  label: string;
  iconName: string;
};

export type HomeDashboardTransactionItem = {
  id: string;
  title: string;
  subtitle: string;
  occurredAt: number;
  amount: number;
  statusLabel: string;
  entryType: FinanceEntryType;
};

export type HomeDashboardState = {
  status: StatusType;
  greeting: string;
  profileName: string;
  accountName: string;
  accountNumber: string;
  currencyCode: string;
  balance: number;
  totalInflow: number;
  totalOutflow: number;
  todayInflow: number;
  todayOutflow: number;
  shortcuts: HomeDashboardShortcutItem[];
  recentTransactions: HomeDashboardTransactionItem[];
  errorMessage: string;
};

export interface HomeDashboardViewModel {
  state: HomeDashboardState;
  onRefreshPress(): Promise<void>;
  onShortcutPress(shortcutKey: HomeShortcutKey): void;
  onViewAllTransactionsPress(): void;
  onNotificationsPress(): void;
  onProfilePress(): void;
}
