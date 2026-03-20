import React from "react";
import { Text, View } from "react-native";
import { styles } from "./QuickPosSummaryPanel.styles";

type Props = {
  label: string;
  value: string;
};

export default function QuickPosSummaryRow({
  label,
  value,
}: Props): React.JSX.Element {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}
