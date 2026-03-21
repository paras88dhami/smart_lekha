import type { TransferRecordTargetType } from "@/features/transfers/record/data/dataSource/transferRecord.model";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  beneficiaryLabel: string;
  ownAccountLabel: string;
  selectedTargetType: TransferRecordTargetType;
  onTargetTypePress: (targetType: TransferRecordTargetType) => void;
};

const TARGET_TYPES: TransferRecordTargetType[] = ["beneficiary", "own_account"];

export default function SendMoneyTransferTargetSwitch({
  title,
  beneficiaryLabel,
  ownAccountLabel,
  selectedTargetType,
  onTargetTypePress,
}: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {TARGET_TYPES.map((targetType) => {
          const isSelected = targetType === selectedTargetType;
          const label = targetType === "beneficiary" ? beneficiaryLabel : ownAccountLabel;

          return (
            <Pressable
              key={targetType}
              style={[styles.button, isSelected ? styles.buttonSelected : null]}
              onPress={(): void => {
                onTargetTypePress(targetType);
              }}
            >
              <Text style={[styles.buttonText, isSelected ? styles.buttonTextSelected : null]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  title: { fontSize: 13, color: KhataColors.mutedText, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KhataColors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: KhataColors.background,
  },
  buttonSelected: { borderColor: KhataColors.primaryDark, backgroundColor: KhataColors.softGreen },
  buttonText: { fontSize: 14, color: KhataColors.text, fontWeight: "700" },
  buttonTextSelected: { color: KhataColors.primaryDark },
});
