import type { ReportPosSalesSummary } from "@/features/reports/overview/types/types";
import ReportsMetricCard from "@/features/reports/overview/ui/components/ReportsMetricCard";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import React from "react";

type Props = {
  summary: ReportPosSalesSummary;
};

export default function ReportsPosSalesSummarySection(
  props: Props,
): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  const amount = formatCurrencyAmount({
    amount: props.summary.posSalesAmount,
    currencyCode: "NPR",
    languageCode,
  });

  return (
    <ReportsMetricCard
      title={t("reports.sections.posSales")}
      items={[
        {
          label: t("reports.summary.posSalesCount"),
          value: String(props.summary.posSalesCount),
        },
        {
          label: t("reports.summary.posSalesAmount"),
          value: amount,
        },
      ]}
    />
  );
}
