import KhataCard from "@/shared/components/ui/KhataCard";
import {
  formatCurrencyAmount,
  type SupportedLanguageCode,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type SummaryCardProps = {
  title: string;
  description: string;
  amount: number;
  openCount: number;
  languageCode: SupportedLanguageCode;
  tone: "receive" | "pay";
};

type Props = {
  toReceive: SummaryCardProps;
  toPay: SummaryCardProps;
};

const createAmountColor = (tone: "receive" | "pay"): string => {
  return tone === "receive" ? KhataColors.primaryDark : KhataColors.error;
};

const SummaryCard = ({
  title,
  description,
  amount,
  openCount,
  languageCode,
  tone,
}: SummaryCardProps): React.JSX.Element => {
  return (
    <KhataCard style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <Text style={[styles.amountText, { color: createAmountColor(tone) }]}>
        {formatCurrencyAmount({
          amount,
          currencyCode: "NPR",
          languageCode,
        })}
      </Text>
      <Text style={styles.countText}>{`${openCount} open`}</Text>
    </KhataCard>
  );
};

export default function TransactionsSummaryCards(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <SummaryCard {...props.toReceive} />
      <SummaryCard {...props.toPay} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: KhataColors.text,
  },
  cardDescription: {
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  amountText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
  },
  countText: {
    fontSize: 12,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
});
