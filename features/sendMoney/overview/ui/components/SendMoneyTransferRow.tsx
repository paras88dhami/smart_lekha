import type { SendMoneyTransferItem } from "@/features/sendMoney/overview/types/types";
import {
  formatCurrencyAmount,
  formatDateTime,
  useTranslation,
} from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  item: SendMoneyTransferItem;
  languageCode: SupportedLanguageCode;
};

const createTransferMeta = (
  item: SendMoneyTransferItem,
  getLabel: (key: string) => string,
): string => {
  if (item.targetType === "own_account") {
    const sourceLabel = item.sourceAccountName ?? "-";
    const destinationLabel = item.destinationAccountName ?? item.targetName;
    return `${sourceLabel} -> ${destinationLabel}`;
  }

  return `${item.sourceAccountName ?? "-"} · ${getLabel(
    `sendMoney.methods.${item.transferMethod}`,
  )}`;
};

export default function SendMoneyTransferRow(props: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{props.item.targetName}</Text>
        <Text style={styles.meta}>{createTransferMeta(props.item, t)}</Text>
        <Text style={styles.meta}>
          {formatDateTime({
            timestamp: props.item.scheduledFor ?? props.item.createdAt,
            languageCode: props.languageCode,
          })}
        </Text>
      </View>

      <View style={styles.amountBlock}>
        <Text style={styles.amount}>
          {formatCurrencyAmount({
            amount: props.item.amount,
            currencyCode: "NPR",
            languageCode: props.languageCode,
          })}
        </Text>
        <Text style={styles.statusText}>{props.item.status.toUpperCase()}</Text>
      </View>
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
  amountBlock: { alignItems: "flex-end", gap: 4 },
  amount: { fontSize: 15, color: KhataColors.text, fontWeight: "800" },
  statusText: { fontSize: 11, color: KhataColors.mutedText, fontWeight: "700" },
});
