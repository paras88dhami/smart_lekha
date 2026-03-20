import type { FinanceAccountType } from "@/features/finance/account/data/dataSource/financeAccount.model";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import CashBankAccountTypeSelector from "./CashBankAccountTypeSelector";

type Props = {
  title: string;
  saveLabel: string;
  accountNamePlaceholder: string;
  accountNumberPlaceholder: string;
  openingBalancePlaceholder: string;
  accountNameInput: string;
  accountNumberInput: string;
  openingBalanceInput: string;
  selectedAccountType: FinanceAccountType;
  isSubmitting: boolean;
  getLabel: (key: string) => string;
  onAccountNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onOpeningBalanceChange: (value: string) => void;
  onAccountTypePress: (accountType: FinanceAccountType) => void;
  onCreateAccountPress: () => void;
};

export default function CashBankAccountFormCard(props: Props): React.JSX.Element {
  return (
    <KhataCard style={styles.card}>
      <Text style={styles.title}>{props.title}</Text>

      <TextInput
        style={styles.input}
        value={props.accountNameInput}
        onChangeText={props.onAccountNameChange}
        placeholder={props.accountNamePlaceholder}
      />

      <TextInput
        style={styles.input}
        value={props.accountNumberInput}
        onChangeText={props.onAccountNumberChange}
        placeholder={props.accountNumberPlaceholder}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        value={props.openingBalanceInput}
        onChangeText={props.onOpeningBalanceChange}
        placeholder={props.openingBalancePlaceholder}
        keyboardType="decimal-pad"
      />

      <CashBankAccountTypeSelector
        selectedAccountType={props.selectedAccountType}
        getLabel={props.getLabel}
        onAccountTypePress={props.onAccountTypePress}
      />

      <KhataButton
        title={props.saveLabel}
        disabled={props.isSubmitting}
        onPress={props.onCreateAccountPress}
      />
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, gap: 10 },
  title: { fontSize: 18, color: KhataColors.text, fontWeight: "800" },
  input: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 12,
    fontSize: 15,
    color: KhataColors.text,
  },
});
