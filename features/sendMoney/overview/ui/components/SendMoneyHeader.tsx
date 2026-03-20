import KhataButton from "@/shared/components/ui/KhataButton";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  addTransferLabel: string;
  cancelLabel: string;
  showAddTransferForm: boolean;
  onToggleAddTransferPress: () => void;
};

export default function SendMoneyHeader(props: Props): React.JSX.Element {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextArea}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.subtitle}>{props.subtitle}</Text>
      </View>

      <KhataButton
        title={props.showAddTransferForm ? props.cancelLabel : props.addTransferLabel}
        variant="secondary"
        style={styles.button}
        onPress={props.onToggleAddTransferPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  headerTextArea: { flex: 1 },
  title: { fontSize: 30, color: KhataColors.text, fontWeight: "800" },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: "500", color: KhataColors.mutedText },
  button: { width: 132, height: 42, borderRadius: 12 },
});
