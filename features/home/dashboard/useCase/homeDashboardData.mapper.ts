import { getHomeShortcutMetadata } from "@/features/home/shortcut/config/homeShortcutCatalog";
import type { HomeShortcut } from "@/features/home/shortcut/types/types";
import type { ActiveProfile } from "@/features/workspace/activeProfile/types/types";
import type { FinanceTransaction } from "@/features/finance/transaction/types/types";
import type { PaymentRecord } from "@/features/transactions/paymentRecord/types/types";
import type {
  HomeDashboardData,
  HomeDashboardPaymentSummary,
  HomeDashboardRecentActivity,
  HomeDashboardShortcut,
} from "../types/types";
import type { HomeDashboardSourceData } from "./loadHomeDashboard.helpers";

const createRecentActivityTitle = (transaction: FinanceTransaction): string => {
  if (transaction.counterpartyName) {
    return transaction.counterpartyName;
  }

  if (transaction.categoryName) {
    return transaction.categoryName;
  }

  if (transaction.note) {
    return transaction.note;
  }

  return "";
};

const mapHomeDashboardShortcut = (shortcut: HomeShortcut): HomeDashboardShortcut => {
  const metadata = getHomeShortcutMetadata(shortcut.shortcutKey);

  return {
    key: shortcut.shortcutKey,
    labelKey: metadata.labelKey,
    iconName: metadata.iconName,
  };
};

const mapRecentActivity = (
  transaction: FinanceTransaction,
): HomeDashboardRecentActivity => {
  return {
    id: transaction.id,
    title: createRecentActivityTitle(transaction),
    occurredAt: transaction.occurredAt,
    amount: transaction.amount,
    status: transaction.status,
    entryType: transaction.entryType,
  };
};

const createPaymentSummary = (
  openPaymentRecords: PaymentRecord[],
): HomeDashboardPaymentSummary => {
  return openPaymentRecords.reduce<HomeDashboardPaymentSummary>(
    (summary, paymentRecord) => {
      if (paymentRecord.direction === "to_receive") {
        return {
          ...summary,
          toReceiveAmount: summary.toReceiveAmount + paymentRecord.outstandingAmount,
          toReceiveCount: summary.toReceiveCount + 1,
        };
      }

      return {
        ...summary,
        toPayAmount: summary.toPayAmount + paymentRecord.outstandingAmount,
        toPayCount: summary.toPayCount + 1,
      };
    },
    {
      toReceiveAmount: 0,
      toReceiveCount: 0,
      toPayAmount: 0,
      toPayCount: 0,
    },
  );
};

export const createHomeDashboardData = (
  activeProfile: ActiveProfile,
  sourceData: HomeDashboardSourceData,
): HomeDashboardData => {
  const shortcuts = [...sourceData.shortcuts]
    .sort((leftShortcut: HomeShortcut, rightShortcut: HomeShortcut): number => {
      return leftShortcut.sortOrder - rightShortcut.sortOrder;
    })
    .map(mapHomeDashboardShortcut);

  return {
    profileName: activeProfile.profileName,
    accountOverview: {
      accountName: sourceData.activeAccount?.accountName ?? "",
      accountNumber: sourceData.activeAccount?.accountNumber ?? "",
      currencyCode: sourceData.activeAccount?.currencyCode ?? "NPR",
      balance: sourceData.activeAccount?.currentBalance ?? 0,
    },
    flowSummary: {
      todayInflow: sourceData.summary.todayInflow,
      todayOutflow: sourceData.summary.todayOutflow,
    },
    paymentSummary: createPaymentSummary(sourceData.openPaymentRecords),
    shortcuts,
    recentActivity: sourceData.recentTransactions.map(mapRecentActivity),
  };
};
