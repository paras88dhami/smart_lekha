import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import AppIcon from "@/shared/components/icons/AppIcon";
import type { SendMoneyAccountItem } from "@/features/sendMoney/overview/types/types";
import {
  getTransferMethodInputConfig,
  type TransferMethodInputConfig,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import type { TransferRecordTargetType } from "@/features/transfers/record/data/dataSource/transferRecord.model";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import SendMoneyAccountSelector from "./SendMoneyAccountSelector";
import SendMoneyTransferTargetSwitch from "./SendMoneyTransferTargetSwitch";

type Props = {
  title: string;
  submitLabel: string;
  transferTargetTitle: string;
  beneficiaryLabel: string;
  ownAccountLabel: string;
  sourceAccountTitle: string;
  destinationAccountTitle: string;
  emptyAccountsLabel: string;
  beneficiaryNamePlaceholder: string;
  accountNumberPlaceholder: string;
  mobileNumberPlaceholder: string;
  amountPlaceholder: string;
  notePlaceholder: string;
  scheduleLabel: string;
  accounts: SendMoneyAccountItem[];
  selectedMethod: TransferMethod;
  selectedTargetType: TransferRecordTargetType;
  selectedSourceAccountId: string;
  selectedDestinationAccountId: string;
  beneficiaryNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  amountInput: string;
  noteInput: string;
  isScheduled: boolean;
  isSubmitting: boolean;
  onTargetTypePress: (targetType: TransferRecordTargetType) => void;
  onSourceAccountPress: (accountId: string) => void;
  onDestinationAccountPress: (accountId: string) => void;
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

      <SendMoneyTransferTargetSwitch
        title={props.transferTargetTitle}
        beneficiaryLabel={props.beneficiaryLabel}
        ownAccountLabel={props.ownAccountLabel}
        selectedTargetType={props.selectedTargetType}
        onTargetTypePress={props.onTargetTypePress}
      />

      <SendMoneyAccountSelector
        title={props.sourceAccountTitle}
        emptyLabel={props.emptyAccountsLabel}
        accounts={props.accounts}
        selectedAccountId={props.selectedSourceAccountId}
        onAccountPress={props.onSourceAccountPress}
      />

      {props.selectedTargetType === "beneficiary" ? (
        <>
          <TextInput
            style={styles.input}
            value={props.beneficiaryNameInput}
            onChangeText={props.onBeneficiaryNameChange}
            placeholder={props.beneficiaryNamePlaceholder}
          />

          {renderTransferDetailInputs(inputConfig, props)}
        </>
      ) : (
        <SendMoneyAccountSelector
          title={props.destinationAccountTitle}
          emptyLabel={props.emptyAccountsLabel}
          accounts={props.accounts.filter(
            (account) => account.id !== props.selectedSourceAccountId,
          )}
          selectedAccountId={props.selectedDestinationAccountId}
          onAccountPress={props.onDestinationAccountPress}
        />
      )}

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
