import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import AppIcon from "@/shared/components/icons/AppIcon";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  CASH_BANK_ACCOUNT_TYPE_ICONS,
  CASH_BANK_ACCOUNT_TYPE_LABEL_KEYS,
  CASH_BANK_ACCOUNT_TYPES,
} from "../cashBankAccountTypeMeta";

type Props = {
  selectedAccountType: FinanceAccountType;
  getLabel: (key: string) => string;
  onAccountTypePress: (accountType: FinanceAccountType) => void;
};

export default function CashBankAccountTypeSelector(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      {CASH_BANK_ACCOUNT_TYPES.map((accountType) => {
        const isSelected = props.selectedAccountType === accountType;

        return (
          <Pressable
            key={accountType}
            style={[styles.button, isSelected ? styles.buttonSelected : null]}
            onPress={(): void => {
              props.onAccountTypePress(accountType);
            }}
          >
            <AppIcon
              family="ion"
              name={CASH_BANK_ACCOUNT_TYPE_ICONS[accountType]}
              size={16}
              color={isSelected ? KhataColors.primaryDark : KhataColors.text}
            />
            <Text style={[styles.label, isSelected ? styles.labelSelected : null]}>
              {props.getLabel(CASH_BANK_ACCOUNT_TYPE_LABEL_KEYS[accountType])}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  button: {
    flex: 1,
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  buttonSelected: { borderColor: KhataColors.primaryDark, backgroundColor: KhataColors.softGreen },
  label: { fontSize: 13, color: KhataColors.text, fontWeight: "700" },
  labelSelected: { color: KhataColors.primaryDark },
});
