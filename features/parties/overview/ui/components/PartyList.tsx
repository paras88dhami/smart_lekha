import type { PartyItem } from "@/features/parties/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import PartyRow from "./PartyRow";

type Props = {
  title: string;
  emptyLabel: string;
  noContactLabel: string;
  items: PartyItem[];
  getLabel: (key: string) => string;
};

export default function PartyList(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <PartyRow
              key={item.id}
              item={item}
              noContactLabel={props.noContactLabel}
              getLabel={props.getLabel}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>{props.emptyLabel}</Text>
        )}
      </KhataCard>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  card: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  emptyText: { textAlign: "center", color: KhataColors.mutedText, fontSize: 14, paddingVertical: 20 },
});
