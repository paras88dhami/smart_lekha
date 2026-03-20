import type { ReportEntryTypeTotalItem } from "@/features/reports/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import { formatCurrencyAmount } from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  emptyLabel: string;
  items: ReportEntryTypeTotalItem[];
  languageCode: SupportedLanguageCode;
};

export default function ReportsEntryTotalsSection(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>
                {formatCurrencyAmount({
                  amount: item.amount,
                  currencyCode: "NPR",
                  languageCode: props.languageCode,
                })}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{props.emptyLabel}</Text>
        )}
      </KhataCard>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  card: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  row: {
    minHeight: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    gap: 8,
  },
  label: { flex: 1, fontSize: 14, color: KhataColors.text, fontWeight: "600" },
  value: { fontSize: 14, color: KhataColors.primaryDark, fontWeight: "800" },
  emptyText: { textAlign: "center", color: KhataColors.mutedText, fontSize: 14, paddingVertical: 20 },
});
