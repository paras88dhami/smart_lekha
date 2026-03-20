import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import { TRANSFER_METHOD_LABEL_KEYS, TRANSFER_METHOD_OPTIONS } from "@/features/transfers/shared/config/transferMethodCatalog";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  selectedMethod: TransferMethod;
  getLabel: (key: string) => string;
  onTransferMethodPress: (method: TransferMethod) => void;
};

export default function PartyTransferMethodSelector(props: Props): React.JSX.Element {
  return (
    <View style={styles.grid}>
      {TRANSFER_METHOD_OPTIONS.map((option) => {
        const isSelected = props.selectedMethod === option.method;

        return (
          <Pressable
            key={option.method}
            style={styles.button}
            onPress={(): void => {
              props.onTransferMethodPress(option.method);
            }}
          >
            <Text style={[styles.buttonText, isSelected ? styles.buttonTextSelected : null]}>
              {props.getLabel(TRANSFER_METHOD_LABEL_KEYS[option.method])}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  button: { width: "50%", paddingHorizontal: 4, marginBottom: 8 },
  buttonText: {
    minHeight: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: 8,
    paddingTop: 10,
    color: KhataColors.mutedText,
    fontSize: 12,
    fontWeight: "700",
  },
  buttonTextSelected: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
    color: KhataColors.primaryDark,
  },
});
