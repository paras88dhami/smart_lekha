import type { HomeDashboardFlowSummary } from "@/features/home/dashboard/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import {
  formatCurrencyAmount,
  useTranslation,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  flowSummary: HomeDashboardFlowSummary;
  currencyCode: string;
};

export default function HomeDashboardSummarySection({
  flowSummary,
  currencyCode,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <View style={styles.summaryGrid}>
      <KhataCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{t("home.summary.todayInflow")}</Text>
        <Text style={styles.summaryPositive}>
          {formatCurrencyAmount({
            amount: flowSummary.todayInflow,
            currencyCode,
            languageCode,
          })}
        </Text>
      </KhataCard>

      <KhataCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{t("home.summary.todayOutflow")}</Text>
        <Text style={styles.summaryNegative}>
          {formatCurrencyAmount({
            amount: flowSummary.todayOutflow,
            currencyCode,
            languageCode,
          })}
        </Text>
      </KhataCard>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  summaryLabel: {
    fontSize: 13,
    color: KhataColors.mutedText,
    fontWeight: "600",
  },
  summaryPositive: {
    marginTop: 10,
    fontSize: 22,
    color: KhataColors.primaryDark,
    fontWeight: "800",
  },
  summaryNegative: {
    marginTop: 10,
    fontSize: 22,
    color: KhataColors.error,
    fontWeight: "800",
  },
});
