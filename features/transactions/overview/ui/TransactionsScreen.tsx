import type { TransactionsViewModel } from "@/features/transactions/overview/viewModel/transactions.viewModel";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";
import TransactionsCreatePaymentCard from "./components/TransactionsCreatePaymentCard";
import TransactionsHeader from "./components/TransactionsHeader";
import TransactionsHistoryFilters from "./components/TransactionsHistoryFilters";
import TransactionsHistorySection from "./components/TransactionsHistorySection";
import TransactionsOpenPaymentsSection from "./components/TransactionsOpenPaymentsSection";
import TransactionsSummaryCards from "./components/TransactionsSummaryCards";

type Props = {
  viewModel: TransactionsViewModel;
};

export default function TransactionsScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <TransactionsHeader
        title={t("transactions.title")}
        subtitle={t("transactions.subtitle")}
        addTransactionLabel={t("transactions.addTransaction")}
        quickPosLabel={t("transactions.quickPos")}
        onAddTransactionPress={viewModel.onAddTransactionPress}
        onQuickPosPress={viewModel.onQuickPosPress}
      />

      <TransactionsSummaryCards
        toReceive={{
          title: t("transactions.toReceive"),
          description: t("transactions.toReceiveDescription"),
          amount: viewModel.state.toReceiveSummary.totalAmount,
          openCount: viewModel.state.toReceiveSummary.openCount,
          openLabel: t("transactions.openLabel"),
          languageCode,
          tone: "receive",
        }}
        toPay={{
          title: t("transactions.toPay"),
          description: t("transactions.toPayDescription"),
          amount: viewModel.state.toPaySummary.totalAmount,
          openCount: viewModel.state.toPaySummary.openCount,
          openLabel: t("transactions.openLabel"),
          languageCode,
          tone: "pay",
        }}
      />

      <TransactionsCreatePaymentCard
        title={t("transactions.createRecordTitle")}
        toReceiveLabel={t("transactions.toReceive")}
        toPayLabel={t("transactions.toPay")}
        partyNamePlaceholder={t("transactions.partyNamePlaceholder")}
        amountPlaceholder={t("transactions.amountPlaceholder")}
        notePlaceholder={t("transactions.notePlaceholder")}
        saveLabel={t("transactions.saveRecord")}
        selectedDirection={viewModel.state.selectedDirection}
        partyNameInput={viewModel.state.form.partyNameInput}
        amountInput={viewModel.state.form.amountInput}
        noteInput={viewModel.state.form.noteInput}
        isSubmitting={viewModel.state.isSubmitting}
        onDirectionPress={viewModel.onDirectionPress}
        onPartyNameChange={viewModel.onPartyNameChange}
        onAmountChange={viewModel.onAmountChange}
        onNoteChange={viewModel.onNoteChange}
        onCreatePaymentPress={(): void => {
          void viewModel.onCreatePaymentPress();
        }}
      />

      <TransactionsOpenPaymentsSection
        title={t("transactions.toReceive")}
        emptyLabel={t("transactions.emptyToReceive")}
        actionLabel={t("transactions.receiveAction")}
        items={viewModel.state.toReceiveItems}
        settlingRecordId={viewModel.state.settlingRecordId}
        languageCode={languageCode}
        onSettlePaymentPress={(recordId: string): void => {
          void viewModel.onSettlePaymentPress(recordId);
        }}
      />

      <TransactionsOpenPaymentsSection
        title={t("transactions.toPay")}
        emptyLabel={t("transactions.emptyToPay")}
        actionLabel={t("transactions.payAction")}
        items={viewModel.state.toPayItems}
        settlingRecordId={viewModel.state.settlingRecordId}
        languageCode={languageCode}
        onSettlePaymentPress={(recordId: string): void => {
          void viewModel.onSettlePaymentPress(recordId);
        }}
      />

      <TransactionsHistoryFilters
        accountsTitle={t("transactions.accountFilterTitle")}
        entryTypesTitle={t("transactions.entryFilterTitle")}
        allAccountsLabel={t("transactions.allAccounts")}
        selectedAccountFilterId={viewModel.state.selectedAccountFilterId}
        selectedEntryFilter={viewModel.state.selectedEntryFilter}
        accountOptions={viewModel.state.accountOptions}
        getLabel={t}
        onAccountFilterPress={viewModel.onAccountFilterPress}
        onEntryFilterPress={viewModel.onEntryFilterPress}
      />

      <TransactionsHistorySection
        title={t("transactions.historyTitle")}
        emptyLabel={t("transactions.empty")}
        items={viewModel.state.historyItems}
        languageCode={languageCode}
        getLabel={t}
        onTransactionPress={viewModel.onTransactionPress}
      />

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
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
