import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
};

export default function NotificationsHeader(props: Props): React.JSX.Element {
  return (
    <View>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, color: KhataColors.text, fontWeight: "800" },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: "500", color: KhataColors.mutedText },
});
