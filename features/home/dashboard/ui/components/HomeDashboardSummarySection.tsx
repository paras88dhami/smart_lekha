import type {
  HomeDashboardFlowSummary,
  HomeDashboardPaymentSummary,
} from "@/features/home/dashboard/types/types";
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
  paymentSummary: HomeDashboardPaymentSummary;
  currencyCode: string;
};

export default function HomeDashboardSummarySection({
  flowSummary,
  paymentSummary,
  currencyCode,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <View style={styles.container}>
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

      <View style={styles.summaryGrid}>
        <KhataCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t("home.summary.toReceive")}</Text>
          <Text style={styles.summaryMeta}>
            {`${paymentSummary.toReceiveCount} ${t("home.summary.openItems")}`}
          </Text>
          <Text style={styles.summaryPositive}>
            {formatCurrencyAmount({
              amount: paymentSummary.toReceiveAmount,
              currencyCode,
              languageCode,
            })}
          </Text>
        </KhataCard>

        <KhataCard style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t("home.summary.toPay")}</Text>
          <Text style={styles.summaryMeta}>
            {`${paymentSummary.toPayCount} ${t("home.summary.openItems")}`}
          </Text>
          <Text style={styles.summaryNegative}>
            {formatCurrencyAmount({
              amount: paymentSummary.toPayAmount,
              currencyCode,
              languageCode,
            })}
          </Text>
        </KhataCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
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
  summaryMeta: {
    marginTop: 4,
    fontSize: 12,
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
