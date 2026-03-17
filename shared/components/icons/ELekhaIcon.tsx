import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { KhataColors } from "@/shared/theme/colors";

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  eColor?: string;
  lekhaColor?: string;
};

export default function ELekhaLogo({
  size = 56,
  style,
  textStyle,
  eColor = KhataColors.primary,
  lekhaColor = KhataColors.primaryDark,
}: Props): React.JSX.Element {
  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.text,
          {
            fontSize: size,
            lineHeight: size * 1.02,
          },
          textStyle,
        ]}
      >
        <Text style={{ color: eColor }}>e</Text>
        <Text style={{ color: lekhaColor }}>Lekha</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  text: {
    fontWeight: "900",
    letterSpacing: -1.2,
    includeFontPadding: false,
  },
});
