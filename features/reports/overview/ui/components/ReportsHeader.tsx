import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  profileName: string;
};

export default function ReportsHeader(props: Props): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.subtitle}>{props.subtitle}</Text>
      </View>

      <Text style={styles.profileText}>{props.profileName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  title: { fontSize: 30, color: KhataColors.text, fontWeight: "800" },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: "500", color: KhataColors.mutedText },
  profileText: { fontSize: 14, color: KhataColors.mutedText, fontWeight: "700" },
});
