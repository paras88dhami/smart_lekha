import type { TransactionsHistoryItem } from "@/features/transactions/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import type { SupportedLanguageCode } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import TransactionsHistoryRow from "./TransactionsHistoryRow";

type Props = {
  title: string;
  emptyLabel: string;
  items: TransactionsHistoryItem[];
  languageCode: SupportedLanguageCode;
  getLabel: (key: string) => string;
  onTransactionPress: (transactionId: string) => void;
};

export default function TransactionsHistorySection(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <TransactionsHistoryRow
              key={item.id}
              item={item}
              languageCode={props.languageCode}
              getLabel={props.getLabel}
              onTransactionPress={props.onTransactionPress}
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
