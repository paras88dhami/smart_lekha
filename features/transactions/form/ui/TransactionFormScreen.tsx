import type { FinanceEntryType } from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { TransactionFormViewModel } from "@/features/transactions/form/viewModel/transactionForm.viewModel";
import { getFinanceEntryTranslationKey } from "@/features/transactions/shared/financeEntryDisplay";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: TransactionFormViewModel;
};

const ENTRY_TYPES: FinanceEntryType[] = [
  "income",
  "expense",
  "payment_in",
  "payment_out",
  "transfer_in",
  "transfer_out",
];

export default function TransactionFormScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const isEditMode = Boolean(viewModel.state.transactionId);

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditMode ? t("transactions.editTransaction") : t("transactions.addTransaction")}
        </Text>
        <Text style={styles.subtitle}>{viewModel.state.profileName}</Text>
      </View>

      <KhataCard style={styles.card}>
        <Text style={styles.sectionTitle}>{t("transactions.accountLabel")}</Text>
        <View style={styles.chipRow}>
          {viewModel.state.accountOptions.map((account) => {
            const selected = viewModel.state.selectedAccountId === account.id;

            return (
              <Pressable
                key={account.id}
                style={[styles.chip, selected ? styles.chipSelected : null]}
                onPress={(): void => {
                  viewModel.onAccountPress(account.id);
                }}
              >
                <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>
                  {account.accountName}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>{t("transactions.entryTypeLabel")}</Text>
        <View style={styles.chipRow}>
          {ENTRY_TYPES.map((entryType) => {
            const selected = viewModel.state.selectedEntryType === entryType;

            return (
              <Pressable
                key={entryType}
                style={[styles.chip, selected ? styles.chipSelected : null]}
                onPress={(): void => {
                  viewModel.onEntryTypePress(entryType);
                }}
              >
                <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>
                  {t(getFinanceEntryTranslationKey(entryType))}
                </Text>
              </Pressable>
            );
          })}
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
          value={viewModel.state.categoryInput}
          onChangeText={viewModel.onCategoryChange}
          placeholder={t("transactions.categoryPlaceholder")}
        />

        <TextInput
          style={styles.input}
          value={viewModel.state.counterpartyInput}
          onChangeText={viewModel.onCounterpartyChange}
          placeholder={t("transactions.partyNamePlaceholder")}
        />

        <TextInput
          style={styles.input}
          value={viewModel.state.occurredOnInput}
          onChangeText={viewModel.onOccurredOnChange}
          placeholder={t("transactions.datePlaceholder")}
        />

        <TextInput
          style={[styles.input, styles.noteInput]}
          value={viewModel.state.noteInput}
          onChangeText={viewModel.onNoteChange}
          placeholder={t("transactions.notePlaceholder")}
          multiline
        />

        <KhataButton
          title={t("common.save")}
          disabled={viewModel.state.isSubmitting}
          onPress={(): void => {
            void viewModel.onSavePress();
          }}
        />
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
  card: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, gap: 10 },
  sectionTitle: { fontSize: 14, color: KhataColors.text, fontWeight: "700" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: { borderColor: KhataColors.primaryDark, backgroundColor: KhataColors.softGreen },
  chipText: { fontSize: 12, color: KhataColors.mutedText, fontWeight: "700" },
  chipTextSelected: { color: KhataColors.primaryDark },
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
  noteInput: { minHeight: 84, paddingTop: 12, textAlignVertical: "top" },
  errorText: { color: KhataColors.error, fontSize: 14, fontWeight: "600" },
});
