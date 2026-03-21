import type { TransactionsHistoryItem } from "@/features/transactions/overview/types/types";
import {
  getFinanceEntryTranslationKey,
  isOutflowFinanceEntryType,
} from "@/features/transactions/shared/financeEntryDisplay";
import AppIcon from "@/shared/components/icons/AppIcon";
import {
  formatCurrencyAmount,
  formatDateTime,
  type SupportedLanguageCode,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: TransactionsHistoryItem;
  languageCode: SupportedLanguageCode;
  getLabel: (key: string) => string;
  onTransactionPress: (transactionId: string) => void;
};

const createStatusLabel = (status: TransactionsHistoryItem["status"]): string => {
  return status.toUpperCase();
};

export default function TransactionsHistoryRow({
  getLabel,
  item,
  languageCode,
  onTransactionPress,
}: Props): React.JSX.Element {
  const isOutflow = isOutflowFinanceEntryType(item.entryType);

  return (
    <Pressable
      style={styles.row}
      onPress={(): void => {
        onTransactionPress(item.id);
      }}
    >
      <View style={styles.iconBubble}>
        <AppIcon
          family="ion"
          name={isOutflow ? "arrow-up-outline" : "arrow-down-outline"}
          size={16}
          color={isOutflow ? KhataColors.error : KhataColors.primaryDark}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.metaText}>{getLabel(getFinanceEntryTranslationKey(item.entryType))}</Text>
        <Text style={styles.metaText}>
          {item.accountName || getLabel("cashBank.title")}
        </Text>
        <Text style={styles.metaText}>
          {formatDateTime({
            timestamp: item.occurredAt,
            languageCode,
          })}
        </Text>
      </View>

      <View style={styles.trailing}>
        <Text style={[styles.amountText, isOutflow ? styles.amountOut : styles.amountIn]}>
          {`${isOutflow ? "-" : "+"} ${formatCurrencyAmount({
            amount: item.amount,
            currencyCode: "NPR",
            languageCode,
          })}`}
        </Text>
        <Text style={styles.statusText}>{createStatusLabel(item.status)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 76,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: KhataColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  metaText: {
    fontSize: 11,
    color: KhataColors.mutedText,
    fontWeight: "600",
  },
  trailing: {
    alignItems: "flex-end",
    maxWidth: 140,
    gap: 2,
  },
  amountText: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
  },
  amountIn: {
    color: KhataColors.primaryDark,
  },
  amountOut: {
    color: KhataColors.error,
  },
  statusText: {
    fontSize: 10,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
});
