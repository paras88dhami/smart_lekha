import type { ReportsViewModel } from "@/features/reports/overview/viewModel/reports.viewModel";
import ReportsEntryTotalsSection from "@/features/reports/overview/ui/components/ReportsEntryTotalsSection";
import ReportsFinancialSummarySection from "@/features/reports/overview/ui/components/ReportsFinancialSummarySection";
import ReportsHeader from "@/features/reports/overview/ui/components/ReportsHeader";
import ReportsPosSalesSummarySection from "@/features/reports/overview/ui/components/ReportsPosSalesSummarySection";
import ReportsTransferSummarySection from "@/features/reports/overview/ui/components/ReportsTransferSummarySection";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: ReportsViewModel;
};

export default function ReportsScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <ReportsHeader
        title={t("reports.title")}
        subtitle={t("reports.subtitle")}
        profileName={viewModel.state.profileName}
      />

      <ReportsFinancialSummarySection summary={viewModel.state.financialSummary} />
      <ReportsTransferSummarySection summary={viewModel.state.transferSummary} />
      <ReportsPosSalesSummarySection summary={viewModel.state.posSalesSummary} />

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
