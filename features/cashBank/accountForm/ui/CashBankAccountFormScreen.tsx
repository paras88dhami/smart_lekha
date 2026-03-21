import CashBankAccountFormCard from "@/features/cashBank/overview/ui/components/CashBankAccountFormCard";
import type { CashBankAccountFormViewModel } from "@/features/cashBank/accountForm/viewModel/cashBankAccountForm.viewModel";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: CashBankAccountFormViewModel;
};

export default function CashBankAccountFormScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();
  const isEditMode = viewModel.state.mode === "edit";

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditMode ? t("cashBank.editAccount") : t("cashBank.addAccount")}
        </Text>
        <Text style={styles.subtitle}>{viewModel.state.profileName}</Text>
      </View>

      {isEditMode ? (
        <KhataCard style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t("cashBank.currentBalance")}</Text>
          <Text style={styles.balanceValue}>
            {formatCurrencyAmount({
              amount: viewModel.state.currentBalance,
              currencyCode: "NPR",
              languageCode,
            })}
          </Text>
        </KhataCard>
      ) : null}

      <CashBankAccountFormCard
        title={t("cashBank.accountFormTitle")}
        saveLabel={t("common.save")}
        accountNamePlaceholder={t("cashBank.form.accountName")}
        accountNumberPlaceholder={t("cashBank.form.accountNumber")}
        openingBalancePlaceholder={t("cashBank.form.openingBalance")}
        accountNameInput={viewModel.state.accountNameInput}
        accountNumberInput={viewModel.state.accountNumberInput}
        openingBalanceInput={viewModel.state.openingBalanceInput}
        selectedAccountType={viewModel.state.selectedAccountType}
        showOpeningBalanceInput={!isEditMode}
        openingBalanceEditable={!isEditMode}
        isSubmitting={viewModel.state.isSubmitting}
        getLabel={t}
        onAccountNameChange={viewModel.onAccountNameChange}
        onAccountNumberChange={viewModel.onAccountNumberChange}
        onOpeningBalanceChange={viewModel.onOpeningBalanceChange}
        onAccountTypePress={viewModel.onAccountTypePress}
        onSubmitPress={(): void => {
          void viewModel.onSavePress();
        }}
      />

      {isEditMode ? (
        <KhataButton
          title={t("cashBank.archiveAccount")}
          variant="secondary"
          disabled={viewModel.state.isArchiving}
          onPress={(): void => {
            void viewModel.onArchivePress();
          }}
        />
      ) : null}

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
  balanceCard: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, gap: 4 },
  balanceLabel: { fontSize: 13, color: KhataColors.mutedText, fontWeight: "700" },
  balanceValue: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  errorText: { color: KhataColors.error, fontSize: 14, fontWeight: "600" },
});
