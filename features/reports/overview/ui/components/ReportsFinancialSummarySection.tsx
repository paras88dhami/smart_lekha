import type { ReportFinancialSummary } from "@/features/reports/overview/types/types";
import ReportsMetricCard from "@/features/reports/overview/ui/components/ReportsMetricCard";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import React from "react";

type Props = {
  summary: ReportFinancialSummary;
};

export default function ReportsFinancialSummarySection(
  props: Props,
): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  const formatAmount = (amount: number): string => {
    return formatCurrencyAmount({ amount, currencyCode: "NPR", languageCode });
  };

  return (
    <ReportsMetricCard
      title={t("reports.sections.financial")}
      items={[
        {
          label: t("reports.summary.totalInflow"),
          value: formatAmount(props.summary.totalInflow),
        },
        {
          label: t("reports.summary.totalOutflow"),
          value: formatAmount(props.summary.totalOutflow),
        },
        {
          label: t("reports.summary.currentNet"),
          value: formatAmount(props.summary.currentNet),
        },
        {
          label: t("reports.summary.todayInflow"),
          value: formatAmount(props.summary.todayInflow),
        },
        {
          label: t("reports.summary.todayOutflow"),
          value: formatAmount(props.summary.todayOutflow),
        },
      ]}
    />
  );
}
