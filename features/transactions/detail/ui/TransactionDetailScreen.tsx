import type { TransactionDetailViewModel } from "@/features/transactions/detail/viewModel/transactionDetail.viewModel";
import { getFinanceEntryTranslationKey } from "@/features/transactions/shared/financeEntryDisplay";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import {
  formatCurrencyAmount,
  formatDateTime,
  useTranslation,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: TransactionDetailViewModel;
};

export default function TransactionDetailScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("transactions.transactionDetailTitle")}</Text>
        <Text style={styles.subtitle}>
          {t(getFinanceEntryTranslationKey(viewModel.state.entryType))}
        </Text>
      </View>

      <KhataCard style={styles.card}>
        <Text style={styles.amount}>
          {formatCurrencyAmount({
            amount: viewModel.state.amount,
            currencyCode: "NPR",
            languageCode,
          })}
        </Text>
        <Text style={styles.metaText}>
          {formatDateTime({
            timestamp: viewModel.state.occurredAt,
            languageCode,
          })}
        </Text>
        <Text style={styles.metaText}>
          {viewModel.state.accountName || t("cashBank.title")}
        </Text>
        {viewModel.state.categoryName ? (
          <Text style={styles.metaText}>{viewModel.state.categoryName}</Text>
        ) : null}
        {viewModel.state.counterpartyName ? (
          <Text style={styles.metaText}>{viewModel.state.counterpartyName}</Text>
        ) : null}
        {viewModel.state.note ? <Text style={styles.noteText}>{viewModel.state.note}</Text> : null}
      </KhataCard>

      {viewModel.state.canEdit ? (
        <View style={styles.actionRow}>
          <KhataButton
            title={t("common.edit")}
            variant="secondary"
            style={styles.actionButton}
            onPress={viewModel.onEditPress}
          />
          <KhataButton
            title={t("common.delete")}
            variant="secondary"
            style={styles.actionButton}
            disabled={viewModel.state.isDeleting}
            onPress={(): void => {
              void viewModel.onDeletePress();
            }}
          />
        </View>
      ) : (
        <Text style={styles.lockedText}>{t("transactions.linkedTransactionHint")}</Text>
      )}

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
  card: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  amount: { fontSize: 24, color: KhataColors.text, fontWeight: "800" },
  metaText: { fontSize: 14, color: KhataColors.mutedText, fontWeight: "600" },
  noteText: { fontSize: 14, color: KhataColors.text, lineHeight: 22 },
  actionRow: { flexDirection: "row", gap: 10 },
  actionButton: { flex: 1, height: 50, borderRadius: 12 },
  lockedText: { fontSize: 13, color: KhataColors.mutedText, fontWeight: "600" },
  errorText: { color: KhataColors.error, fontSize: 14, fontWeight: "600" },
});
