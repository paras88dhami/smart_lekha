import type { PaymentRecordDirection } from "@/features/transactions/paymentRecord/data/dataSource/paymentRecord.model";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  title: string;
  toReceiveLabel: string;
  toPayLabel: string;
  partyNamePlaceholder: string;
  amountPlaceholder: string;
  notePlaceholder: string;
  saveLabel: string;
  selectedDirection: PaymentRecordDirection;
  partyNameInput: string;
  amountInput: string;
  noteInput: string;
  isSubmitting: boolean;
  onDirectionPress: (direction: PaymentRecordDirection) => void;
  onPartyNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onCreatePaymentPress: () => void;
};

const createToggleStyle = (
  selectedDirection: PaymentRecordDirection,
  buttonDirection: PaymentRecordDirection,
) => {
  return selectedDirection === buttonDirection ? styles.toggleButtonSelected : null;
};

export default function TransactionsCreatePaymentCard(props: Props): React.JSX.Element {
  return (
    <KhataCard style={styles.card}>
      <Text style={styles.title}>{props.title}</Text>

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleButton, createToggleStyle(props.selectedDirection, "to_receive")]}
          onPress={(): void => {
            props.onDirectionPress("to_receive");
          }}
        >
          <Text style={styles.toggleText}>{props.toReceiveLabel}</Text>
        </Pressable>

        <Pressable
          style={[styles.toggleButton, createToggleStyle(props.selectedDirection, "to_pay")]}
          onPress={(): void => {
            props.onDirectionPress("to_pay");
          }}
        >
          <Text style={styles.toggleText}>{props.toPayLabel}</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        value={props.partyNameInput}
        onChangeText={props.onPartyNameChange}
        placeholder={props.partyNamePlaceholder}
      />

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

      <KhataButton
        title={props.saveLabel}
        disabled={props.isSubmitting}
        onPress={props.onCreatePaymentPress}
      />
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  title: {
    fontSize: 20,
    color: KhataColors.text,
    fontWeight: "800",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
  },
  toggleText: {
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "700",
  },
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
