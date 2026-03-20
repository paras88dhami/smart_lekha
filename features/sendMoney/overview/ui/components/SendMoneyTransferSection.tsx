import type { SendMoneyTransferItem } from "@/features/sendMoney/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SendMoneyTransferRow from "./SendMoneyTransferRow";

export type SendMoneySectionAction = {
  label: string;
  onPress: () => void;
} | null;

type Props = {
  title: string;
  emptyLabel: string;
  items: SendMoneyTransferItem[];
  languageCode: SupportedLanguageCode;
  action: SendMoneySectionAction;
};

export default function SendMoneyTransferSection(props: Props): React.JSX.Element {
  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{props.title}</Text>
        {props.action ? (
          <Pressable onPress={props.action.onPress}>
            <Text style={styles.actionText}>{props.action.label}</Text>
          </Pressable>
        ) : null}
      </View>

      <KhataCard style={styles.card}>
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <SendMoneyTransferRow key={item.id} item={item} languageCode={props.languageCode} />
          ))
        ) : (
          <Text style={styles.emptyText}>{props.emptyLabel}</Text>
        )}
      </KhataCard>
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 20, color: KhataColors.text, fontWeight: "800" },
  actionText: { fontSize: 14, color: KhataColors.primaryDark, fontWeight: "700" },
  card: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  emptyText: { textAlign: "center", fontSize: 14, color: KhataColors.mutedText, paddingVertical: 14 },
});
