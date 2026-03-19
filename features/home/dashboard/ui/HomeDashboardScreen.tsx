import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { HomeDashboardViewModel } from "@/features/home/dashboard/viewModel/homeDashboard.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import {
  formatCurrencyAmount,
  formatDateTime,
  useTranslation,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: HomeDashboardViewModel;
};

const OUTFLOW_ENTRY_TYPES: FinanceEntryType[] = [
  "expense",
  "payment_out",
  "transfer_out",
];

const getInitials = (name: string): string => {
  const parts = name
    .trim()
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2);

  if (parts.length <= 0) {
    return "EL";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export default function HomeDashboardScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTextArea}>
            <Text style={styles.greetingText}>{viewModel.state.greeting}</Text>
            <Text style={styles.profileNameText}>{viewModel.state.profileName}</Text>
          </View>

          <View style={styles.heroActions}>
            <Pressable onPress={viewModel.onNotificationsPress} style={styles.heroActionButton}>
              <AppIcon family="ion" name="notifications-outline" size={20} color={KhataColors.surface} />
            </Pressable>

            <Pressable onPress={viewModel.onProfilePress} style={styles.avatarButton}>
              <Text style={styles.avatarText}>{getInitials(viewModel.state.profileName)}</Text>
            </Pressable>
          </View>
        </View>

        <KhataCard style={styles.accountCard}>
          <Text style={styles.accountNameText}>{viewModel.state.accountName}</Text>
          {viewModel.state.accountNumber ? (
            <Text style={styles.accountNumberText}>{viewModel.state.accountNumber}</Text>
          ) : null}
          <Text style={styles.balanceText}>
            {formatCurrencyAmount({
              amount: viewModel.state.balance,
              currencyCode: viewModel.state.currencyCode,
              languageCode,
            })}
          </Text>
        </KhataCard>
      </View>

      <View style={styles.summaryGrid}>
        <KhataCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t("home.summary.todayInflow")}</Text>
          <Text style={styles.summaryPositive}>
            {formatCurrencyAmount({
              amount: viewModel.state.todayInflow,
              currencyCode: viewModel.state.currencyCode,
              languageCode,
            })}
          </Text>
        </KhataCard>

        <KhataCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t("home.summary.todayOutflow")}</Text>
          <Text style={styles.summaryNegative}>
            {formatCurrencyAmount({
              amount: viewModel.state.todayOutflow,
              currencyCode: viewModel.state.currencyCode,
              languageCode,
            })}
          </Text>
        </KhataCard>
      </View>

      <View style={styles.shortcutsHeader}>
        <Text style={styles.sectionTitle}>{t("home.shortcuts.title")}</Text>
      </View>
      <View style={styles.shortcutGrid}>
        {viewModel.state.shortcuts.map((shortcut) => {
          return (
            <Pressable
              key={shortcut.key}
              style={styles.shortcutItem}
              onPress={(): void => {
                viewModel.onShortcutPress(shortcut.key);
              }}
            >
              <KhataCard style={styles.shortcutCard}>
                <View style={styles.shortcutIconBubble}>
                  <AppIcon
                    family="ion"
                    name={shortcut.iconName}
                    size={20}
                    color={KhataColors.primaryDark}
                  />
                </View>
                <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
              </KhataCard>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>{t("home.transactions.title")}</Text>
        <Pressable onPress={viewModel.onViewAllTransactionsPress}>
          <Text style={styles.viewAllText}>{t("home.transactions.viewAll")}</Text>
        </Pressable>
      </View>

      <KhataCard style={styles.transactionsCard}>
        {viewModel.state.recentTransactions.length > 0 ? (
          viewModel.state.recentTransactions.map((transaction) => {
            const isOutflow = OUTFLOW_ENTRY_TYPES.includes(transaction.entryType);

            return (
              <View key={transaction.id} style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
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
                      currencyCode: viewModel.state.currencyCode,
                      languageCode,
                    })}`}
                  </Text>
                  <Text style={styles.transactionStatus}>{transaction.statusLabel}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t("home.transactions.empty")}</Text>
        )}
      </KhataCard>

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
  heroCard: {
    borderRadius: 18,
    backgroundColor: KhataColors.primaryDark,
    padding: 14,
    gap: 12,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  heroTextArea: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  profileNameText: {
    marginTop: 2,
    fontSize: 24,
    color: KhataColors.surface,
    fontWeight: "800",
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "800",
    color: KhataColors.surface,
  },
  accountCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  accountNameText: {
    fontSize: 16,
    color: KhataColors.text,
    fontWeight: "700",
  },
  accountNumberText: {
    marginTop: 2,
    fontSize: 13,
    color: KhataColors.mutedText,
  },
  balanceText: {
    marginTop: 8,
    fontSize: 26,
    color: KhataColors.text,
    fontWeight: "800",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: KhataColors.mutedText,
    fontWeight: "600",
  },
  summaryPositive: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: KhataColors.primaryDark,
  },
  summaryNegative: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: KhataColors.error,
  },
  shortcutsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 22,
    color: KhataColors.text,
    fontWeight: "800",
  },
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  shortcutItem: {
    width: "33.333%",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  shortcutCard: {
    borderRadius: 12,
    minHeight: 102,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 8,
  },
  shortcutIconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutLabel: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: KhataColors.text,
  },
  transactionsHeader: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: KhataColors.primaryDark,
    fontWeight: "700",
  },
  transactionsCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  transactionRow: {
    minHeight: 60,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: 150,
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
  transactionAmountPositive: {
    color: KhataColors.primaryDark,
  },
  transactionAmountNegative: {
    color: KhataColors.error,
  },
  transactionStatus: {
    marginTop: 3,
    fontSize: 10,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
    paddingVertical: 20,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
