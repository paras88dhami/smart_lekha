import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  profileName: string;
  generatedAtLabel: string;
};

export default function DownloadDataHeader(props: Props): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.subtitle}>{props.subtitle}</Text>
      </View>

      <Text style={styles.profileText}>{props.profileName}</Text>
      {props.generatedAtLabel ? (
        <Text style={styles.generatedAtText}>{props.generatedAtLabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  title: { fontSize: 30, color: KhataColors.text, fontWeight: "800" },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: "500", color: KhataColors.mutedText },
  profileText: { fontSize: 14, color: KhataColors.mutedText, fontWeight: "700" },
  generatedAtText: { fontSize: 12, color: KhataColors.mutedText, fontWeight: "600" },
});
