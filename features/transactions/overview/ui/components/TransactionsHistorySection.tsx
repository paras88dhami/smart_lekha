import type {
  FinanceEntryType,
  FinanceEntryStatus,
} from "@/features/finance/transaction/data/dataSource/financeTransaction.model";
import type { TransactionsHistoryItem } from "@/features/transactions/overview/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataCard from "@/shared/components/ui/KhataCard";
import {
  formatCurrencyAmount,
  formatDateTime,
  type SupportedLanguageCode,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  emptyLabel: string;
  items: TransactionsHistoryItem[];
  languageCode: SupportedLanguageCode;
};

const OUTFLOW_ENTRY_TYPES: FinanceEntryType[] = [
  "expense",
  "payment_out",
  "transfer_out",
];

const isOutflowEntryType = (entryType: FinanceEntryType): boolean => {
  return OUTFLOW_ENTRY_TYPES.includes(entryType);
};

const createStatusLabel = (status: FinanceEntryStatus): string => {
  return status.toUpperCase();
};

export default function TransactionsHistorySection(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.items.length > 0 ? (
          props.items.map((item) => {
            const isOutflow = isOutflowEntryType(item.entryType);

            return (
              <View key={item.id} style={styles.row}>
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
                  <Text style={styles.meta}>
                    {formatDateTime({
                      timestamp: item.occurredAt,
                      languageCode: props.languageCode,
                    })}
                  </Text>
                </View>

                <View style={styles.trailing}>
                  <Text
                    style={[
                      styles.amount,
                      isOutflow ? styles.amountOut : styles.amountIn,
                    ]}
                  >
                    {`${isOutflow ? "-" : "+"} ${formatCurrencyAmount({
                      amount: item.amount,
                      currencyCode: "NPR",
                      languageCode: props.languageCode,
                    })}`}
                  </Text>
                  <Text style={styles.status}>{createStatusLabel(item.status)}</Text>
                </View>
              </View>
            );
          })
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
  row: {
    minHeight: 60,
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
  },
  titleText: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  trailing: {
    alignItems: "flex-end",
    maxWidth: 140,
  },
  amount: {
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
  status: {
    marginTop: 2,
    fontSize: 10,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  emptyText: {
    paddingVertical: 16,
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
  },
});
