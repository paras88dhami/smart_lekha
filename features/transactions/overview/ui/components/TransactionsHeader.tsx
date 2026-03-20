import KhataButton from "@/shared/components/ui/KhataButton";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  quickPosLabel: string;
  onQuickPosPress: () => void;
};

export default function TransactionsHeader(props: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.textArea}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.subtitle}>{props.subtitle}</Text>
      </View>

      <KhataButton
        title={props.quickPosLabel}
        onPress={props.onQuickPosPress}
        style={styles.button}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  textArea: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: KhataColors.mutedText,
  },
  button: {
    width: 126,
    height: 44,
    borderRadius: 12,
  },
});
