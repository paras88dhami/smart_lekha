import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { HomeDashboardRecentActivity } from "@/features/home/dashboard/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import {
  formatCurrencyAmount,
  formatDateTime,
  useTranslation,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  recentActivity: HomeDashboardRecentActivity[];
  currencyCode: string;
  onViewAllTransactionsPress(): void;
};

const OUTFLOW_ENTRY_TYPES: FinanceEntryType[] = [
  "expense",
  "payment_out",
  "transfer_out",
];

const isOutflowEntryType = (entryType: FinanceEntryType): boolean => {
  return OUTFLOW_ENTRY_TYPES.includes(entryType);
};

const getRecentActivityTitle = (
  transaction: HomeDashboardRecentActivity,
  fallbackTitle: string,
): string => {
  return transaction.title || fallbackTitle;
};

export default function HomeDashboardRecentActivitySection({
  recentActivity,
  currencyCode,
  onViewAllTransactionsPress,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{t("home.transactions.title")}</Text>
        <Pressable onPress={onViewAllTransactionsPress}>
          <Text style={styles.viewAllText}>{t("home.transactions.viewAll")}</Text>
        </Pressable>
      </View>

      <KhataCard style={styles.transactionsCard}>
        {recentActivity.length > 0 ? (
          recentActivity.map((transaction: HomeDashboardRecentActivity): React.JSX.Element => {
            const isOutflow = isOutflowEntryType(transaction.entryType);

            return (
              <View key={transaction.id} style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionTitle}>
                    {getRecentActivityTitle(transaction, t("home.transactions.defaultTitle"))}
                  </Text>
                  <Text style={styles.transactionSubtitle}>
                    {formatDateTime({
                      timestamp: transaction.occurredAt,
                      languageCode,
                    })}
                  </Text>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      isOutflow ? styles.transactionAmountNegative : styles.transactionAmountPositive,
                    ]}
                  >
                    {`${isOutflow ? "-" : "+"} ${formatCurrencyAmount({
                      amount: transaction.amount,
                      currencyCode,
                      languageCode,
                    })}`}
                  </Text>
                  <Text style={styles.transactionStatus}>{transaction.status.toUpperCase()}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t("home.transactions.empty")}</Text>
        )}
      </KhataCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    color: KhataColors.text,
    fontWeight: "800",
  },
  viewAllText: {
    fontSize: 14,
    color: KhataColors.primary,
    fontWeight: "700",
  },
  transactionsCard: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  transactionRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 10,
    gap: 10,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  transactionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: KhataColors.mutedText,
    fontWeight: "500",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "800",
  },
  transactionAmountPositive: {
    color: KhataColors.primaryDark,
  },
  transactionAmountNegative: {
    color: KhataColors.error,
  },
  transactionStatus: {
    marginTop: 4,
    fontSize: 11,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    color: KhataColors.mutedText,
    paddingVertical: 20,
  },
});
