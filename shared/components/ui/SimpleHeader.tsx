import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import { KhataColors } from "@/shared/theme/colors";

type Props = { title: string; rightIcon?: string };

export default function SimpleHeader(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{props.title}</Text>
      {props.rightIcon ? <AppIcon family="ion" name={props.rightIcon} size={28} color={KhataColors.primary} /> : <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "800", color: KhataColors.text },
  spacer: { width: 28 },
});
