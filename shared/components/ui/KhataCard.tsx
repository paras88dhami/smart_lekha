import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { KhataColors } from "@/shared/theme/colors";

type Props = { children: React.ReactNode; style?: StyleProp<ViewStyle> };

export default function KhataCard(props: Props): React.JSX.Element {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: KhataColors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: KhataColors.border,
    padding: 18,
  },
});
