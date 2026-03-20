import type { TransactionsOpenPaymentItem } from "@/features/transactions/overview/types/types";
import KhataButton from "@/shared/components/ui/KhataButton";
import {
  formatCurrencyAmount,
  formatDateTime,
  type SupportedLanguageCode,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  item: TransactionsOpenPaymentItem;
  actionLabel: string;
  languageCode: SupportedLanguageCode;
  isSettling: boolean;
  onSettlePaymentPress: (recordId: string) => void;
};

export default function TransactionsOpenPaymentRow(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <Text style={styles.partyName}>{props.item.partyName}</Text>
        <Text style={styles.meta}>
          {formatDateTime({
            timestamp: props.item.createdAt,
            languageCode: props.languageCode,
          })}
        </Text>
        {props.item.note ? <Text style={styles.note}>{props.item.note}</Text> : null}
      </View>

      <View style={styles.actions}>
        <Text style={styles.amount}>
          {formatCurrencyAmount({
            amount: props.item.outstandingAmount,
            currencyCode: "NPR",
            languageCode: props.languageCode,
          })}
        </Text>
        <KhataButton
          title={props.actionLabel}
          disabled={props.isSettling}
          onPress={(): void => {
            props.onSettlePaymentPress(props.item.id);
          }}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  content: {
    flex: 1,
  },
  partyName: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  note: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.primaryDark,
  },
  actions: {
    alignItems: "flex-end",
    gap: 6,
    width: 132,
  },
  amount: {
    fontSize: 13,
    fontWeight: "800",
    color: KhataColors.text,
    textAlign: "right",
  },
  button: {
    minWidth: 110,
    height: 36,
    borderRadius: 10,
  },
});
