import type { CashBankAccountStatementViewModel } from "@/features/cashBank/accountStatement/viewModel/cashBankAccountStatement.viewModel";
import {
  getFinanceEntryTranslationKey,
  isOutflowFinanceEntryType,
} from "@/features/transactions/shared/financeEntryDisplay";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import {
  formatCurrencyAmount,
  formatDateTime,
  useTranslation,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: CashBankAccountStatementViewModel;
};

export default function CashBankAccountStatementScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{viewModel.state.accountName}</Text>
        <Text style={styles.subtitle}>
          {viewModel.state.accountNumber || t("cashBank.noAccountNumber")}
        </Text>
      </View>

      <KhataCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{t("cashBank.currentBalance")}</Text>
        <Text style={styles.summaryValue}>
          {formatCurrencyAmount({
            amount: viewModel.state.currentBalance,
            currencyCode: viewModel.state.currencyCode,
            languageCode,
          })}
        </Text>
      </KhataCard>

      <Text style={styles.sectionTitle}>{t("cashBank.statement")}</Text>
      <KhataCard style={styles.listCard}>
        {viewModel.state.statementItems.length > 0 ? (
          viewModel.state.statementItems.map((item) => {
            const isOutflow = isOutflowFinanceEntryType(item.entryType);

            return (
              <Pressable
                key={item.id}
                style={styles.row}
                onPress={(): void => {
                  viewModel.onTransactionPress(item.id);
                }}
              >
                <View style={styles.iconBubble}>
                  <AppIcon
                    family="ion"
                    name={isOutflow ? "arrow-up-outline" : "arrow-down-outline"}
                    size={16}
                    color={isOutflow ? KhataColors.error : KhataColors.primaryDark}
                  />
                </View>

                <View style={styles.content}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowSubtitle}>
                    {t(getFinanceEntryTranslationKey(item.entryType))}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {formatDateTime({
                      timestamp: item.occurredAt,
                      languageCode,
                    })}
                  </Text>
                </View>

                <Text style={[styles.amount, isOutflow ? styles.amountOut : styles.amountIn]}>
                  {`${isOutflow ? "-" : "+"} ${formatCurrencyAmount({
                    amount: item.amount,
                    currencyCode: viewModel.state.currencyCode,
                    languageCode,
                  })}`}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t("cashBank.emptyStatement")}</Text>
        )}
      </KhataCard>

      {viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },
  header: { gap: 4 },
  title: { fontSize: 30, color: KhataColors.text, fontWeight: "800" },
  subtitle: { fontSize: 14, color: KhataColors.mutedText, fontWeight: "700" },
  summaryCard: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, gap: 4 },
  summaryLabel: { fontSize: 13, color: KhataColors.mutedText, fontWeight: "700" },
  summaryValue: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  sectionTitle: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  listCard: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  row: {
    minHeight: 68,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: KhataColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
  rowTitle: { fontSize: 15, color: KhataColors.text, fontWeight: "700" },
  rowSubtitle: { marginTop: 2, fontSize: 12, color: KhataColors.primaryDark, fontWeight: "700" },
  rowMeta: { marginTop: 2, fontSize: 11, color: KhataColors.mutedText },
  amount: { fontSize: 13, fontWeight: "800", textAlign: "right", maxWidth: 140 },
  amountIn: { color: KhataColors.primaryDark },
  amountOut: { color: KhataColors.error },
  emptyText: { paddingVertical: 16, textAlign: "center", color: KhataColors.mutedText, fontSize: 14 },
  errorText: { color: KhataColors.error, fontSize: 14, fontWeight: "600" },
});
