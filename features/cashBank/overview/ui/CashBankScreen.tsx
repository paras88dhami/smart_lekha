import type { CashBankViewModel } from "@/features/cashBank/overview/viewModel/cashBank.viewModel";
import CashBankAccountFormCard from "@/features/cashBank/overview/ui/components/CashBankAccountFormCard";
import CashBankAccountList from "@/features/cashBank/overview/ui/components/CashBankAccountList";
import CashBankHeader from "@/features/cashBank/overview/ui/components/CashBankHeader";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: CashBankViewModel;
};

export default function CashBankScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <CashBankHeader
        title={t("cashBank.title")}
        subtitle={t("cashBank.subtitle")}
        profileName={viewModel.state.profileName}
        addAccountLabel={t("cashBank.addAccount")}
        cancelLabel={t("common.cancel")}
        showAddAccountForm={viewModel.state.showAddAccountForm}
        onToggleAddAccountPress={viewModel.onToggleAddAccountPress}
      />

      {viewModel.state.showAddAccountForm ? (
        <CashBankAccountFormCard
          title={t("cashBank.addAccount")}
          saveLabel={t("common.save")}
          accountNamePlaceholder={t("cashBank.form.accountName")}
          accountNumberPlaceholder={t("cashBank.form.accountNumber")}
          openingBalancePlaceholder={t("cashBank.form.openingBalance")}
          accountNameInput={viewModel.state.form.accountNameInput}
          accountNumberInput={viewModel.state.form.accountNumberInput}
          openingBalanceInput={viewModel.state.form.openingBalanceInput}
          selectedAccountType={viewModel.state.form.selectedAccountType}
          isSubmitting={viewModel.state.status === Status.Loading}
          getLabel={t}
          onAccountNameChange={viewModel.onAccountNameChange}
          onAccountNumberChange={viewModel.onAccountNumberChange}
          onOpeningBalanceChange={viewModel.onOpeningBalanceChange}
          onAccountTypePress={viewModel.onAccountTypePress}
          onCreateAccountPress={(): void => {
            void viewModel.onCreateAccountPress();
          }}
        />
      ) : null}

      <CashBankAccountList
        title={t("cashBank.accounts")}
        emptyLabel={t("cashBank.empty")}
        noAccountNumberLabel={t("cashBank.noAccountNumber")}
        primaryLabel={t("cashBank.primary")}
        setPrimaryLabel={t("cashBank.setPrimary")}
        languageCode={languageCode}
        accounts={viewModel.state.accounts}
        getLabel={t}
        onSetPrimaryPress={(accountId: string): void => {
          void viewModel.onSetPrimaryPress(accountId);
        }}
      />

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },
  errorText: { color: KhataColors.error, fontSize: 14, fontWeight: "600" },
});
