import type { TransactionsOpenPaymentItem } from "@/features/transactions/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import type { SupportedLanguageCode } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import TransactionsOpenPaymentRow from "./TransactionsOpenPaymentRow";

type Props = {
  title: string;
  emptyLabel: string;
  actionLabel: string;
  items: TransactionsOpenPaymentItem[];
  settlingRecordId: string | null;
  languageCode: SupportedLanguageCode;
  onSettlePaymentPress: (recordId: string) => void;
};

export default function TransactionsOpenPaymentsSection(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <TransactionsOpenPaymentRow
              key={item.id}
              item={item}
              actionLabel={props.actionLabel}
              languageCode={props.languageCode}
              isSettling={props.settlingRecordId === item.id}
              onSettlePaymentPress={props.onSettlePaymentPress}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>{props.emptyLabel}</Text>
        )}
      </KhataCard>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: KhataColors.text,
    fontWeight: "800",
  },
  card: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emptyText: {
    paddingVertical: 16,
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
  },
});
