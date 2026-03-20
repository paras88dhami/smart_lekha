import type { CashBankAccountItem } from "@/features/cashBank/overview/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import { formatCurrencyAmount } from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  CASH_BANK_ACCOUNT_TYPE_ICONS,
  CASH_BANK_ACCOUNT_TYPE_LABEL_KEYS,
} from "../cashBankAccountTypeMeta";

type Props = {
  account: CashBankAccountItem;
  languageCode: SupportedLanguageCode;
  noAccountNumberLabel: string;
  primaryLabel: string;
  setPrimaryLabel: string;
  getLabel: (key: string) => string;
  onSetPrimaryPress: (accountId: string) => void;
};

export default function CashBankAccountRow(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.iconBubble}>
        <AppIcon
          family="ion"
          name={CASH_BANK_ACCOUNT_TYPE_ICONS[props.account.accountType]}
          size={18}
          color={KhataColors.primaryDark}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{props.account.accountName}</Text>
        <Text style={styles.subtitle}>
          {props.account.accountNumber || props.noAccountNumberLabel}
        </Text>
        <Text style={styles.meta}>
          {props.getLabel(CASH_BANK_ACCOUNT_TYPE_LABEL_KEYS[props.account.accountType])}
        </Text>
      </View>

      <View style={styles.trailing}>
        <Text style={styles.amount}>
          {formatCurrencyAmount({
            amount: props.account.currentBalance,
            currencyCode: props.account.currencyCode,
            languageCode: props.languageCode,
          })}
        </Text>

        {props.account.isPrimary ? (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryBadgeText}>{props.primaryLabel}</Text>
          </View>
        ) : (
          <Pressable
            style={styles.primaryAction}
            onPress={(): void => {
              props.onSetPrimaryPress(props.account.id);
            }}
          >
            <Text style={styles.primaryActionText}>{props.setPrimaryLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  name: { fontSize: 15, color: KhataColors.text, fontWeight: "700" },
  subtitle: { marginTop: 2, fontSize: 12, color: KhataColors.mutedText },
  meta: { marginTop: 2, fontSize: 11, color: KhataColors.primaryDark, fontWeight: "700" },
  trailing: { alignItems: "flex-end", justifyContent: "center", gap: 6 },
  amount: { fontSize: 13, color: KhataColors.text, fontWeight: "800", textAlign: "right" },
  primaryBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: KhataColors.softGreen,
  },
  primaryBadgeText: { fontSize: 11, color: KhataColors.primaryDark, fontWeight: "700" },
  primaryAction: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: KhataColors.background,
    borderWidth: 1,
    borderColor: KhataColors.border,
  },
  primaryActionText: { fontSize: 11, color: KhataColors.mutedText, fontWeight: "700" },
});
