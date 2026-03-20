import {
  getTransferMethodInputConfig,
  type TransferMethodInputConfig,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import type { TransferMethod } from "@/features/transfers/shared/types/transferMethod.types";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import PartyTransferMethodSelector from "./PartyTransferMethodSelector";

type Props = {
  title: string;
  saveLabel: string;
  namePlaceholder: string;
  bankNamePlaceholder: string;
  accountNumberPlaceholder: string;
  mobileNumberPlaceholder: string;
  markFavoriteLabel: string;
  partyNameInput: string;
  bankNameInput: string;
  accountNumberInput: string;
  mobileNumberInput: string;
  selectedTransferMethod: TransferMethod;
  markAsFavorite: boolean;
  isSubmitting: boolean;
  getLabel: (key: string) => string;
  onPartyNameChange: (value: string) => void;
  onBankNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onMobileNumberChange: (value: string) => void;
  onTransferMethodPress: (method: TransferMethod) => void;
  onFavoriteTogglePress: () => void;
  onSavePartyPress: () => void;
};

const renderContactDetailInputs = (
  inputConfig: TransferMethodInputConfig,
  props: Props,
): React.JSX.Element[] => {
  const inputElements: React.JSX.Element[] = [];

  if (inputConfig.showsBankNameInput) {
    inputElements.push(
      <TextInput
        key="bank-name"
        style={styles.input}
        value={props.bankNameInput}
        onChangeText={props.onBankNameChange}
        placeholder={props.bankNamePlaceholder}
      />,
    );
  }

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

export default function PartyFormCard(props: Props): React.JSX.Element {
  const inputConfig = getTransferMethodInputConfig(props.selectedTransferMethod);

  return (
    <KhataCard style={styles.card}>
      <Text style={styles.title}>{props.title}</Text>

      <TextInput
        style={styles.input}
        value={props.partyNameInput}
        onChangeText={props.onPartyNameChange}
        placeholder={props.namePlaceholder}
      />

      {renderContactDetailInputs(inputConfig, props)}

      <PartyTransferMethodSelector
        selectedMethod={props.selectedTransferMethod}
        getLabel={props.getLabel}
        onTransferMethodPress={props.onTransferMethodPress}
      />

      <View style={styles.favoriteRow}>
        <Text style={styles.favoriteText}>{props.markFavoriteLabel}</Text>
        <Switch
          value={props.markAsFavorite}
          onValueChange={props.onFavoriteTogglePress}
          trackColor={{ false: KhataColors.border, true: KhataColors.primary }}
        />
      </View>

      <KhataButton title={props.saveLabel} disabled={props.isSubmitting} onPress={props.onSavePartyPress} />
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
  favoriteRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  favoriteText: { fontSize: 14, color: KhataColors.text, fontWeight: "600" },
});
