import type { SendMoneyBeneficiaryItem } from "@/features/sendMoney/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import SendMoneyBeneficiaryRow from "./SendMoneyBeneficiaryRow";

type Props = {
  title: string;
  emptyLabel: string;
  items: SendMoneyBeneficiaryItem[];
  getLabel: (key: string) => string;
};

export default function SendMoneyBeneficiarySection(props: Props): React.JSX.Element {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <KhataCard style={styles.card}>
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <SendMoneyBeneficiaryRow key={item.id} item={item} getLabel={props.getLabel} />
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
  emptyText: { textAlign: "center", fontSize: 14, color: KhataColors.mutedText, paddingVertical: 14 },
});
