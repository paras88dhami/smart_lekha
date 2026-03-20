import type { ReportTransferSummary } from "@/features/reports/overview/types/types";
import ReportsMetricCard from "@/features/reports/overview/ui/components/ReportsMetricCard";
import { useTranslation } from "@/shared/i18n/resources";
import React from "react";

type Props = {
  summary: ReportTransferSummary;
};

export default function ReportsTransferSummarySection(
  props: Props,
): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ReportsMetricCard
      title={t("reports.sections.transfers")}
      items={[
        {
          label: t("reports.summary.savedTransfers"),
          value: String(props.summary.savedTransfersCount),
        },
        {
          label: t("reports.summary.scheduledTransfers"),
          value: String(props.summary.scheduledTransfersCount),
        },
      ]}
    />
  );
}
