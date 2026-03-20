import type { ReportsViewModel } from "@/features/reports/overview/viewModel/reports.viewModel";
import ReportsEntryTotalsSection from "@/features/reports/overview/ui/components/ReportsEntryTotalsSection";
import ReportsHeader from "@/features/reports/overview/ui/components/ReportsHeader";
import ReportsMetricCard from "@/features/reports/overview/ui/components/ReportsMetricCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: ReportsViewModel;
};

export default function ReportsScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();
  const formatAmount = (amount: number): string =>
    formatCurrencyAmount({ amount, currencyCode: "NPR", languageCode });

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <ReportsHeader
        title={t("reports.title")}
        subtitle={t("reports.subtitle")}
        profileName={viewModel.state.profileName}
      />

      <ReportsMetricCard
        title={t("reports.sections.financial")}
        items={[
          { label: t("reports.summary.totalInflow"), value: formatAmount(viewModel.state.totalInflow) },
          { label: t("reports.summary.totalOutflow"), value: formatAmount(viewModel.state.totalOutflow) },
          { label: t("reports.summary.currentNet"), value: formatAmount(viewModel.state.currentNet) },
          { label: t("reports.summary.todayInflow"), value: formatAmount(viewModel.state.todayInflow) },
          { label: t("reports.summary.todayOutflow"), value: formatAmount(viewModel.state.todayOutflow) },
        ]}
      />

      <ReportsMetricCard
        title={t("reports.sections.transfers")}
        items={[
          { label: t("reports.summary.savedTransfers"), value: String(viewModel.state.savedTransfersCount) },
          { label: t("reports.summary.scheduledTransfers"), value: String(viewModel.state.scheduledTransfersCount) },
        ]}
      />

      <ReportsMetricCard
        title={t("reports.sections.posSales")}
        items={[
          { label: t("reports.summary.posSalesCount"), value: String(viewModel.state.posSalesCount) },
          { label: t("reports.summary.posSalesAmount"), value: formatAmount(viewModel.state.posSalesAmount) },
        ]}
      />

      <ReportsEntryTotalsSection
        title={t("reports.entryTotalsTitle")}
        emptyLabel={t("reports.empty")}
        items={viewModel.state.entryTypeTotals}
        languageCode={languageCode}
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
