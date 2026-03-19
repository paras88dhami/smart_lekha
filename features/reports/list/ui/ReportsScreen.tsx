import type { ReportsViewModel } from "@/features/reports/list/viewModel/reports.viewModel";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: ReportsViewModel;
};

const SummaryItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element => {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
};

export default function ReportsScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View>
        <Text style={styles.title}>{t("reports.title")}</Text>
        <Text style={styles.subtitle}>{t("reports.subtitle")}</Text>
      </View>

      <Text style={styles.profileText}>{viewModel.state.profileName}</Text>

      <KhataCard style={styles.summaryCard}>
        <SummaryItem
          label={t("reports.summary.totalInflow")}
          value={formatCurrencyAmount({
            amount: viewModel.state.totalInflow,
            currencyCode: "NPR",
            languageCode,
          })}
        />
        <SummaryItem
          label={t("reports.summary.totalOutflow")}
          value={formatCurrencyAmount({
            amount: viewModel.state.totalOutflow,
            currencyCode: "NPR",
            languageCode,
          })}
        />
        <SummaryItem
          label={t("reports.summary.currentNet")}
          value={formatCurrencyAmount({
            amount: viewModel.state.currentNet,
            currencyCode: "NPR",
            languageCode,
          })}
        />
        <SummaryItem
          label={t("reports.summary.todayInflow")}
          value={formatCurrencyAmount({
            amount: viewModel.state.todayInflow,
            currencyCode: "NPR",
            languageCode,
          })}
        />
        <SummaryItem
          label={t("reports.summary.todayOutflow")}
          value={formatCurrencyAmount({
            amount: viewModel.state.todayOutflow,
            currencyCode: "NPR",
            languageCode,
          })}
        />
      </KhataCard>

      <KhataCard style={styles.summaryCard}>
        <SummaryItem
          label={t("reports.summary.posSalesCount")}
          value={String(viewModel.state.posSalesCount)}
        />
        <SummaryItem
          label={t("reports.summary.posSalesAmount")}
          value={formatCurrencyAmount({
            amount: viewModel.state.posSalesAmount,
            currencyCode: "NPR",
            languageCode,
          })}
        />
        <SummaryItem
          label={t("reports.summary.savedTransfers")}
          value={String(viewModel.state.savedTransfersCount)}
        />
        <SummaryItem
          label={t("reports.summary.scheduledTransfers")}
          value={String(viewModel.state.scheduledTransfersCount)}
        />
      </KhataCard>

      <Text style={styles.sectionTitle}>{t("reports.entryTotalsTitle")}</Text>
      <KhataCard style={styles.listCard}>
        {viewModel.state.entryTypeTotals.length > 0 ? (
          viewModel.state.entryTypeTotals.map((item) => (
            <View key={item.label} style={styles.listRow}>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Text style={styles.listValue}>
                {formatCurrencyAmount({
                  amount: item.amount,
                  currencyCode: "NPR",
                  languageCode,
                })}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("reports.empty")}</Text>
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
  summaryCard: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    color: KhataColors.primaryDark,
    fontWeight: "800",
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
  listRow: {
    minHeight: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    gap: 8,
  },
  listLabel: {
    flex: 1,
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "600",
  },
  listValue: {
    fontSize: 14,
    color: KhataColors.primaryDark,
    fontWeight: "800",
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
