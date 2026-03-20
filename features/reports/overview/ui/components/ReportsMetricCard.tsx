import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type ReportsMetricItem = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  items: ReportsMetricItem[];
};

export default function ReportsMetricCard(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.sectionTitle}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.items.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </KhataCard>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  card: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  label: { flex: 1, fontSize: 14, color: KhataColors.text, fontWeight: "600" },
  value: { fontSize: 14, color: KhataColors.primaryDark, fontWeight: "800" },
});
