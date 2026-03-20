import type { TransferMethod } from "@/features/transfers/beneficiary/data/dataSource/transferBeneficiary.model";
import {
  TRANSFER_METHOD_ICONS,
  TRANSFER_METHOD_LABEL_KEYS,
  TRANSFER_METHOD_OPTIONS,
} from "@/features/transfers/shared/config/transferMethodCatalog";
import AppIcon from "@/shared/components/icons/AppIcon";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  selectedMethod: TransferMethod;
  getLabel: (key: string) => string;
  onMethodPress: (method: TransferMethod) => void;
};

export default function SendMoneyMethodGrid(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <View style={styles.grid}>
        {TRANSFER_METHOD_OPTIONS.map((option) => {
          const isSelected = props.selectedMethod === option.method;

          return (
            <Pressable
              key={option.method}
              style={[styles.card, isSelected ? styles.cardSelected : null]}
              onPress={(): void => {
                props.onMethodPress(option.method);
              }}
            >
              <View style={[styles.iconBubble, isSelected ? styles.iconBubbleSelected : null]}>
                <AppIcon
                  family="ion"
                  name={TRANSFER_METHOD_ICONS[option.method]}
                  size={18}
                  color={isSelected ? KhataColors.primaryDark : KhataColors.text}
                />
              </View>
              <Text style={[styles.label, isSelected ? styles.labelSelected : null]}>
                {props.getLabel(TRANSFER_METHOD_LABEL_KEYS[option.method])}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  card: {
    width: "50%",
    minHeight: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardSelected: { borderColor: KhataColors.primaryDark, backgroundColor: KhataColors.softGreen },
  iconBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: KhataColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubbleSelected: { backgroundColor: "rgba(255,255,255,0.7)" },
  label: { fontSize: 13, color: KhataColors.text, fontWeight: "700", textAlign: "center" },
  labelSelected: { color: KhataColors.primaryDark },
});
