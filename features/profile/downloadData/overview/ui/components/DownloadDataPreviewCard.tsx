import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

type Props = {
  jsonPreview: string;
  emptyLabel: string;
};

export default function DownloadDataPreviewCard(props: Props): React.JSX.Element {
  return (
    <KhataCard style={styles.card}>
      {props.jsonPreview ? (
        <ScrollView nestedScrollEnabled style={styles.previewScroll}>
          <Text style={styles.previewText}>{props.jsonPreview}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>{props.emptyLabel}</Text>
      )}
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 10, maxHeight: 320 },
  previewScroll: { maxHeight: 300 },
  previewText: { fontSize: 11, color: KhataColors.text, lineHeight: 16 },
  emptyText: {
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
    paddingVertical: 20,
  },
});
