import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
};

export default function MoreHeader(props: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 2 },
  title: { fontSize: 30, fontWeight: "800", color: KhataColors.text },
  subtitle: { fontSize: 13, color: KhataColors.mutedText, fontWeight: "500" },
});
