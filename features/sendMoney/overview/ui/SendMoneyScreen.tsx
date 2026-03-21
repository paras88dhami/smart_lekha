import type { SendMoneyViewModel } from "@/features/sendMoney/overview/viewModel/sendMoney.viewModel";
import SendMoneyBeneficiarySection from "@/features/sendMoney/overview/ui/components/SendMoneyBeneficiarySection";
import SendMoneyHeader from "@/features/sendMoney/overview/ui/components/SendMoneyHeader";
import SendMoneyMethodGrid from "@/features/sendMoney/overview/ui/components/SendMoneyMethodGrid";
import SendMoneyTransferForm from "@/features/sendMoney/overview/ui/components/SendMoneyTransferForm";
import SendMoneyTransferSection from "@/features/sendMoney/overview/ui/components/SendMoneyTransferSection";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: SendMoneyViewModel;
};

export default function SendMoneyScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <SendMoneyHeader
        title={t("sendMoney.title")}
        subtitle={t("sendMoney.subtitle")}
        addTransferLabel={t("sendMoney.addTransfer")}
        cancelLabel={t("common.cancel")}
        showAddTransferForm={viewModel.state.showAddTransferForm}
        onToggleAddTransferPress={viewModel.onToggleAddTransferPress}
      />

      <SendMoneyMethodGrid
        title={t("sendMoney.methodsTitle")}
        selectedMethod={viewModel.state.selectedMethod}
        getLabel={t}
        onMethodPress={viewModel.onMethodPress}
      />

      {viewModel.state.showAddTransferForm ? (
        <SendMoneyTransferForm
          title={t("sendMoney.addTransfer")}
          submitLabel={t("sendMoney.form.submit")}
          transferTargetTitle={t("sendMoney.form.transferTarget")}
          beneficiaryLabel={t("sendMoney.form.transferToBeneficiary")}
          ownAccountLabel={t("sendMoney.form.transferToOwnAccount")}
          sourceAccountTitle={t("sendMoney.form.sourceAccount")}
          destinationAccountTitle={t("sendMoney.form.destinationAccount")}
          emptyAccountsLabel={t("sendMoney.empty.accounts")}
          beneficiaryNamePlaceholder={t("sendMoney.form.beneficiaryName")}
          accountNumberPlaceholder={t("sendMoney.form.accountNumber")}
          mobileNumberPlaceholder={t("sendMoney.form.mobileNumber")}
          amountPlaceholder={t("sendMoney.form.amount")}
          notePlaceholder={t("sendMoney.form.note")}
          scheduleLabel={t("sendMoney.form.scheduleForTomorrow")}
          accounts={viewModel.state.accounts}
          selectedMethod={viewModel.state.selectedMethod}
          selectedTargetType={viewModel.state.form.targetType}
          selectedSourceAccountId={viewModel.state.form.sourceAccountId}
          selectedDestinationAccountId={viewModel.state.form.destinationAccountId}
          beneficiaryNameInput={viewModel.state.form.beneficiaryNameInput}
          accountNumberInput={viewModel.state.form.accountNumberInput}
          mobileNumberInput={viewModel.state.form.mobileNumberInput}
          amountInput={viewModel.state.form.amountInput}
          noteInput={viewModel.state.form.noteInput}
          isScheduled={viewModel.state.form.isScheduled}
          isSubmitting={viewModel.state.status === Status.Loading}
          onTargetTypePress={viewModel.onTargetTypePress}
          onSourceAccountPress={viewModel.onSourceAccountPress}
          onDestinationAccountPress={viewModel.onDestinationAccountPress}
          onBeneficiaryNameChange={viewModel.onBeneficiaryNameChange}
          onAccountNumberChange={viewModel.onAccountNumberChange}
          onMobileNumberChange={viewModel.onMobileNumberChange}
          onAmountChange={viewModel.onAmountChange}
          onNoteChange={viewModel.onNoteChange}
          onScheduleTogglePress={viewModel.onScheduleTogglePress}
          onSubmitTransferPress={(): void => {
            void viewModel.onSubmitTransferPress();
          }}
        />
      ) : null}

      <SendMoneyBeneficiarySection
        title={t("sendMoney.favoritesTitle")}
        emptyLabel={t("sendMoney.empty.favorites")}
        items={viewModel.state.favorites}
        getLabel={t}
      />

      <SendMoneyBeneficiarySection
        title={t("sendMoney.beneficiariesTitle")}
        emptyLabel={t("sendMoney.empty.beneficiaries")}
        items={viewModel.state.beneficiaries}
        getLabel={t}
      />

      <SendMoneyTransferSection
        title={t("sendMoney.savedTitle")}
        emptyLabel={t("sendMoney.empty.saved")}
        items={viewModel.state.savedTransfers}
        languageCode={languageCode}
        action={{ label: t("sendMoney.viewAllSaved"), onPress: viewModel.onViewAllSavedPress }}
      />

      <SendMoneyTransferSection
        title={t("sendMoney.scheduledTitle")}
        emptyLabel={t("sendMoney.empty.scheduled")}
        items={viewModel.state.scheduledTransfers}
        languageCode={languageCode}
        action={null}
      />

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },
  errorText: { fontSize: 14, color: KhataColors.error, fontWeight: "600" },
});
