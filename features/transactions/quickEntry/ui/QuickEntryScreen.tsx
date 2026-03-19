import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { QuickEntryViewModel } from "@/features/transactions/quickEntry/viewModel/quickEntry.viewModel";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatCurrencyAmount, formatDateTime, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: QuickEntryViewModel;
};

const ENTRY_TYPES: FinanceEntryType[] = ["income", "expense", "payment_in", "payment_out"];

const ENTRY_TYPE_LABEL_MAP: Record<FinanceEntryType, string> = {
  income: "notifications.entryTypes.income",
  expense: "notifications.entryTypes.expense",
  payment_in: "notifications.entryTypes.paymentIn",
  payment_out: "notifications.entryTypes.paymentOut",
  transfer_out: "notifications.entryTypes.transferOut",
  transfer_in: "notifications.entryTypes.transferIn",
  pos_sale: "notifications.entryTypes.posSale",
};

const isOutflow = (entryType: FinanceEntryType): boolean => {
  return entryType === "expense" || entryType === "payment_out" || entryType === "transfer_out";
};

export default function QuickEntryScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View>
        <Text style={styles.title}>{t("quickEntry.title")}</Text>
        <Text style={styles.subtitle}>{t("quickEntry.subtitle")}</Text>
      </View>

      <Text style={styles.profileText}>{viewModel.state.profileName}</Text>

      <KhataCard style={styles.formCard}>
        <View style={styles.typeRow}>
          {ENTRY_TYPES.map((entryType) => {
            const selected = viewModel.state.selectedEntryType === entryType;

            return (
              <Pressable
                key={entryType}
                style={[styles.typeButton, selected ? styles.typeButtonSelected : null]}
                onPress={(): void => {
                  viewModel.onEntryTypePress(entryType);
                }}
              >
                <Text style={[styles.typeText, selected ? styles.typeTextSelected : null]}>
                  {t(ENTRY_TYPE_LABEL_MAP[entryType])}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          style={styles.input}
          value={viewModel.state.categoryInput}
          onChangeText={viewModel.onCategoryChange}
          placeholder={t("quickEntry.form.category")}
        />

        <TextInput
          style={styles.input}
          value={viewModel.state.counterpartyInput}
          onChangeText={viewModel.onCounterpartyChange}
          placeholder={t("quickEntry.form.counterparty")}
        />

        <TextInput
          style={styles.input}
          value={viewModel.state.amountInput}
          onChangeText={viewModel.onAmountChange}
          placeholder={t("quickEntry.form.amount")}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={styles.input}
          value={viewModel.state.noteInput}
          onChangeText={viewModel.onNoteChange}
          placeholder={t("quickEntry.form.note")}
        />

        <KhataButton
          title={t("quickEntry.form.save")}
          disabled={viewModel.state.status === Status.Loading}
          onPress={(): void => {
            void viewModel.onSavePress();
          }}
        />
      </KhataCard>

      <Text style={styles.sectionTitle}>{t("quickEntry.recentEntries")}</Text>
      <KhataCard style={styles.listCard}>
        {viewModel.state.recentEntries.length > 0 ? (
          viewModel.state.recentEntries.map((entry) => {
            const outflow = isOutflow(entry.entryType);

            return (
              <View key={entry.id} style={styles.rowItem}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowTitle}>{entry.title}</Text>
                  <Text style={styles.rowSubtitle}>{t(ENTRY_TYPE_LABEL_MAP[entry.entryType])}</Text>
                  <Text style={styles.rowMeta}>
                    {formatDateTime({
                      timestamp: entry.occurredAt,
                      languageCode,
                    })}
                  </Text>
                </View>

                <Text style={[styles.rowAmount, outflow ? styles.rowAmountOut : styles.rowAmountIn]}>
                  {`${outflow ? "-" : "+"} ${formatCurrencyAmount({
                    amount: entry.amount,
                    currencyCode: "NPR",
                    languageCode,
                  })}`}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t("quickEntry.empty")}</Text>
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
  title: {
    fontSize: 30,
    color: KhataColors.text,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: KhataColors.mutedText,
  },
  profileText: {
    fontSize: 14,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  formCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  typeButton: {
    width: "50%",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  typeButtonSelected: {
    opacity: 1,
  },
  typeText: {
    minHeight: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: 8,
    paddingTop: 10,
    color: KhataColors.mutedText,
    fontSize: 12,
    fontWeight: "700",
  },
  typeTextSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
    color: KhataColors.primaryDark,
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
  sectionTitle: {
    fontSize: 20,
    color: KhataColors.text,
    fontWeight: "800",
  },
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rowItem: {
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 8,
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
    color: KhataColors.primaryDark,
    fontWeight: "700",
  },
  rowMeta: {
    marginTop: 2,
    fontSize: 11,
    color: KhataColors.mutedText,
  },
  rowAmount: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
  rowAmountIn: {
    color: KhataColors.primaryDark,
  },
  rowAmountOut: {
    color: KhataColors.error,
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
