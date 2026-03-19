import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { TransactionsViewModel } from "@/features/transactions/overview/viewModel/transactions.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
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
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: TransactionsViewModel;
};

const OUTFLOW_ENTRY_TYPES: FinanceEntryType[] = [
  "payment_out",
  "expense",
  "transfer_out",
];

export default function TransactionsScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextArea}>
          <Text style={styles.title}>{t("transactions.title")}</Text>
          <Text style={styles.subtitle}>{t("transactions.subtitle")}</Text>
        </View>

        <KhataButton
          title={t("transactions.quickPos")}
          onPress={viewModel.onQuickPosPress}
          style={styles.quickPosButton}
          variant="secondary"
        />
      </View>

      <KhataCard style={styles.entryCard}>
        <Text style={styles.sectionTitle}>{t("transactions.addEntryTitle")}</Text>

        <View style={styles.toggleRow}>
          <Pressable
            style={[
              styles.toggleButton,
              viewModel.state.selectedEntryType === "payment_in"
                ? styles.toggleButtonActive
                : null,
            ]}
            onPress={(): void => {
              viewModel.onEntryTypePress("payment_in");
            }}
          >
            <AppIcon family="ion" name="arrow-down-outline" size={14} color={KhataColors.primaryDark} />
            <Text style={styles.toggleLabel}>{t("transactions.paymentIn")}</Text>
          </Pressable>

          <Pressable
            style={[
              styles.toggleButton,
              viewModel.state.selectedEntryType === "payment_out"
                ? styles.toggleButtonActive
                : null,
            ]}
            onPress={(): void => {
              viewModel.onEntryTypePress("payment_out");
            }}
          >
            <AppIcon family="ion" name="arrow-up-outline" size={14} color={KhataColors.error} />
            <Text style={styles.toggleLabel}>{t("transactions.paymentOut")}</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          value={viewModel.state.amountInput}
          onChangeText={viewModel.onAmountChange}
          placeholder={t("transactions.amountPlaceholder")}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={styles.input}
          value={viewModel.state.noteInput}
          onChangeText={viewModel.onNoteChange}
          placeholder={t("transactions.notePlaceholder")}
        />

        <KhataButton
          title={t("transactions.addEntry")}
          disabled={viewModel.state.status === Status.Loading}
          onPress={(): void => {
            void viewModel.onAddEntryPress();
          }}
        />
      </KhataCard>

      <Text style={styles.sectionTitle}>{t("transactions.historyTitle")}</Text>
      <KhataCard style={styles.listCard}>
        {viewModel.state.transactions.length > 0 ? (
          viewModel.state.transactions.map((transaction) => {
            const isOutflow = OUTFLOW_ENTRY_TYPES.includes(transaction.entryType);

            return (
              <View key={transaction.id} style={styles.rowItem}>
                <View style={styles.rowLeadingIcon}>
                  <AppIcon
                    family="ion"
                    name={isOutflow ? "arrow-up-outline" : "arrow-down-outline"}
                    size={16}
                    color={isOutflow ? KhataColors.error : KhataColors.primaryDark}
                  />
                </View>

                <View style={styles.rowLeft}>
                  <Text style={styles.rowTitle}>{transaction.title}</Text>
                  <Text style={styles.rowSubtitle}>{formatDateTime({ timestamp: transaction.occurredAt, languageCode })}</Text>
                </View>

                <View style={styles.rowRight}>
                  <Text
                    style={[
                      styles.rowAmount,
                      isOutflow ? styles.rowAmountNegative : styles.rowAmountPositive,
                    ]}
                  >
                    {`${isOutflow ? "-" : "+"} ${formatCurrencyAmount({
                      amount: transaction.amount,
                      currencyCode: "NPR",
                      languageCode,
                    })}`}
                  </Text>
                  <Text style={styles.rowStatus}>{transaction.statusLabel}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyWrapper}>
            <AppIcon
              family="ion"
              name="receipt-outline"
              size={24}
              color={KhataColors.mutedText}
            />
            <Text style={styles.emptyText}>{t("transactions.empty")}</Text>
          </View>
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
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  headerTextArea: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: KhataColors.mutedText,
  },
  quickPosButton: {
    width: 126,
    height: 44,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: KhataColors.text,
    fontWeight: "800",
  },
  entryCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: KhataColors.surface,
    flexDirection: "row",
    gap: 6,
  },
  toggleButtonActive: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
  },
  toggleLabel: {
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "700",
  },
  input: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 12,
    fontSize: 15,
    color: KhataColors.text,
  },
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rowItem: {
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowLeadingIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: KhataColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLeft: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  rowRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: 140,
  },
  rowAmount: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
  },
  rowAmountPositive: {
    color: KhataColors.primaryDark,
  },
  rowAmountNegative: {
    color: KhataColors.error,
  },
  rowStatus: {
    marginTop: 2,
    fontSize: 10,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  emptyWrapper: {
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});


