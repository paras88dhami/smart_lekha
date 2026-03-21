import type { SendMoneyAccountItem } from "@/features/sendMoney/overview/types/types";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  emptyLabel: string;
  accounts: SendMoneyAccountItem[];
  selectedAccountId: string;
  onAccountPress: (accountId: string) => void;
};

const getAccountTypeLabelKey = (accountType: SendMoneyAccountItem["accountType"]): string => {
  return `cashBank.accountTypes.${accountType}`;
};

export default function SendMoneyAccountSelector({
  title,
  emptyLabel,
  accounts,
  selectedAccountId,
  onAccountPress,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {accounts.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
          {accounts.map((account) => {
            const isSelected = account.id === selectedAccountId;

            return (
              <Pressable
                key={account.id}
                style={[styles.card, isSelected ? styles.cardSelected : null]}
                onPress={(): void => {
                  onAccountPress(account.id);
                }}
              >
                <Text style={[styles.name, isSelected ? styles.nameSelected : null]}>
                  {account.accountName}
                </Text>
                <Text style={styles.meta}>{t(getAccountTypeLabelKey(account.accountType))}</Text>
                <Text style={[styles.amount, isSelected ? styles.amountSelected : null]}>
                  {formatCurrencyAmount({
                    amount: account.currentBalance,
                    currencyCode: account.currencyCode,
                    languageCode,
                  })}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>{emptyLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { fontSize: 13, color: KhataColors.mutedText, fontWeight: "700" },
  list: { gap: 10, paddingRight: 4 },
  card: {
    minWidth: 144,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  cardSelected: { borderColor: KhataColors.primaryDark, backgroundColor: KhataColors.softGreen },
  name: { fontSize: 14, color: KhataColors.text, fontWeight: "700" },
  nameSelected: { color: KhataColors.primaryDark },
  meta: { fontSize: 12, color: KhataColors.mutedText },
  amount: { fontSize: 13, color: KhataColors.text, fontWeight: "700" },
  amountSelected: { color: KhataColors.primaryDark },
  emptyText: { fontSize: 13, color: KhataColors.mutedText },
});
