import type { SendMoneyTransferItem } from "@/features/sendMoney/overview/types/types";
import { formatCurrencyAmount, formatDateTime } from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  item: SendMoneyTransferItem;
  languageCode: SupportedLanguageCode;
};

export default function SendMoneyTransferRow(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>
          {formatCurrencyAmount({
            amount: props.item.amount,
            currencyCode: "NPR",
            languageCode: props.languageCode,
          })}
        </Text>
        <Text style={styles.meta}>
          {formatDateTime({
            timestamp: props.item.scheduledFor ?? props.item.createdAt,
            languageCode: props.languageCode,
          })}
        </Text>
      </View>

      <Text style={styles.statusText}>{props.item.status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    gap: 10,
  },
  info: { flex: 1 },
  name: { fontSize: 15, color: KhataColors.text, fontWeight: "700" },
  meta: { marginTop: 2, fontSize: 12, color: KhataColors.mutedText },
  statusText: { fontSize: 11, color: KhataColors.mutedText, fontWeight: "700" },
});
