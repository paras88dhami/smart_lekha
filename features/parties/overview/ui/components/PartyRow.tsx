import type { PartyItem } from "@/features/parties/overview/types/types";
import { TRANSFER_METHOD_LABEL_KEYS } from "@/features/transfers/shared/config/transferMethodCatalog";
import AppIcon from "@/shared/components/icons/AppIcon";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ").filter((part) => part.length > 0).slice(0, 2);
  return parts.length > 0 ? parts.map((part) => part[0]?.toUpperCase() ?? "").join("") : "PT";
};

type Props = {
  item: PartyItem;
  noContactLabel: string;
  getLabel: (key: string) => string;
};

export default function PartyRow(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.avatarBubble}>
        <Text style={styles.avatarText}>{getInitials(props.item.name)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{props.item.name}</Text>
        <Text style={styles.subtitle}>
          {props.item.mobileNumber || props.item.accountNumber || props.noContactLabel}
        </Text>
        {props.item.bankName ? <Text style={styles.meta}>{props.item.bankName}</Text> : null}
      </View>

      <View style={styles.trailing}>
        <Text style={styles.methodBadge}>
          {props.getLabel(TRANSFER_METHOD_LABEL_KEYS[props.item.transferMethod])}
        </Text>
        {props.item.isFavorite ? (
          <AppIcon family="ion" name="star" size={14} color={KhataColors.primaryDark} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  avatarBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 12, color: KhataColors.primaryDark, fontWeight: "800" },
  content: { flex: 1 },
  title: { fontSize: 15, color: KhataColors.text, fontWeight: "700" },
  subtitle: { marginTop: 2, fontSize: 12, color: KhataColors.mutedText },
  meta: { marginTop: 2, fontSize: 11, color: KhataColors.primaryDark, fontWeight: "700" },
  trailing: { alignItems: "flex-end", gap: 6 },
  methodBadge: { fontSize: 11, color: KhataColors.primaryDark, fontWeight: "700", textAlign: "right" },
});
