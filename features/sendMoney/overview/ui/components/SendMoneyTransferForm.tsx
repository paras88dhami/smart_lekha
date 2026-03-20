import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import AppIcon from "@/shared/components/icons/AppIcon";
import {
  getTransferMethodInputConfig,
  type TransferMethodInputConfig,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  title: string;
  submitLabel: string;
  beneficiaryNamePlaceholder: string;
  accountNumberPlaceholder: string;
  mobileNumberPlaceholder: string;
  amountPlaceholder: string;
  notePlaceholder: string;
  scheduleLabel: string;
  selectedMethod: TransferMethod;
  beneficiaryNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  amountInput: string;
  noteInput: string;
  isScheduled: boolean;
  isSubmitting: boolean;
  onBeneficiaryNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onMobileNumberChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onScheduleTogglePress: () => void;
  onSubmitTransferPress: () => void;
};

const renderTransferDetailInputs = (
  inputConfig: TransferMethodInputConfig,
  props: Props,
): React.JSX.Element[] => {
  const inputElements: React.JSX.Element[] = [];

  if (inputConfig.showsAccountNumberInput) {
    inputElements.push(
      <TextInput
        key="account-number"
        style={styles.input}
        value={props.accountNumberInput}
        onChangeText={props.onAccountNumberChange}
        placeholder={props.accountNumberPlaceholder}
        keyboardType="number-pad"
      />,
    );
  }

  if (inputConfig.showsMobileNumberInput) {
    inputElements.push(
      <TextInput
        key="mobile-number"
        style={styles.input}
        value={props.mobileNumberInput}
        onChangeText={props.onMobileNumberChange}
        placeholder={props.mobileNumberPlaceholder}
        keyboardType="phone-pad"
      />,
    );
  }

  return inputElements;
};

export default function SendMoneyTransferForm(props: Props): React.JSX.Element {
  const inputConfig = getTransferMethodInputConfig(props.selectedMethod);

  return (
    <KhataCard style={styles.card}>
      <Text style={styles.title}>{props.title}</Text>

      <TextInput
        style={styles.input}
        value={props.beneficiaryNameInput}
        onChangeText={props.onBeneficiaryNameChange}
        placeholder={props.beneficiaryNamePlaceholder}
      />

      {renderTransferDetailInputs(inputConfig, props)}

      <TextInput
        style={styles.input}
        value={props.amountInput}
        onChangeText={props.onAmountChange}
        placeholder={props.amountPlaceholder}
        keyboardType="decimal-pad"
      />

      <TextInput
        style={styles.input}
        value={props.noteInput}
        onChangeText={props.onNoteChange}
        placeholder={props.notePlaceholder}
      />

      <Pressable style={styles.scheduleRow} onPress={props.onScheduleTogglePress}>
        <View style={[styles.checkBox, props.isScheduled ? styles.checkBoxSelected : null]}>
          {props.isScheduled ? (
            <AppIcon family="ion" name="checkmark" size={12} color={KhataColors.surface} />
          ) : null}
        </View>
        <Text style={styles.scheduleText}>{props.scheduleLabel}</Text>
      </Pressable>

      <KhataButton
        title={props.submitLabel}
        disabled={props.isSubmitting}
        onPress={props.onSubmitTransferPress}
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
  scheduleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxSelected: { borderColor: KhataColors.primaryDark, backgroundColor: KhataColors.primaryDark },
  scheduleText: { fontSize: 14, color: KhataColors.text, fontWeight: "600" },
});
