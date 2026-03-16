import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { KhataColors } from "@/shared/theme/colors";

type Props = {
  title: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function KhataButton(props: Props): React.JSX.Element {
  const variant = props.variant ?? "primary";
  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={[styles.base, variant === "primary" ? styles.primary : styles.secondary, props.style, props.disabled ? styles.disabled : null]}
    >
      <Text style={[styles.text, variant === "primary" ? styles.primaryText : styles.secondaryText]}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 58, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  primary: { backgroundColor: KhataColors.primary, borderColor: KhataColors.primary },
  secondary: { backgroundColor: KhataColors.surface, borderColor: KhataColors.border },
  text: { fontSize: 18, fontWeight: "700" },
  primaryText: { color: KhataColors.surface },
  secondaryText: { color: KhataColors.text },
  disabled: { opacity: 0.45 },
});
