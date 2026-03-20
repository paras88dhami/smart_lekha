import KhataButton from "@/shared/components/ui/KhataButton";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  profileName: string;
  addPartyLabel: string;
  cancelLabel: string;
  showAddPartyForm: boolean;
  onToggleAddPartyPress: () => void;
};

export default function PartiesHeader(props: Props): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextArea}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subtitle}>{props.subtitle}</Text>
        </View>

        <KhataButton
          title={props.showAddPartyForm ? props.cancelLabel : props.addPartyLabel}
          variant="secondary"
          style={styles.button}
          onPress={props.onToggleAddPartyPress}
        />
      </View>

      <Text style={styles.profileText}>{props.profileName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  headerTextArea: { flex: 1 },
  title: { fontSize: 30, color: KhataColors.text, fontWeight: "800" },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: "500", color: KhataColors.mutedText },
  profileText: { fontSize: 14, color: KhataColors.mutedText, fontWeight: "700" },
  button: { width: 122, height: 42, borderRadius: 12 },
});
