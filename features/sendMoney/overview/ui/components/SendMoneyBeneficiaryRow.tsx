import type { SendMoneyBeneficiaryItem } from "@/features/sendMoney/overview/types/types";
import { TRANSFER_METHOD_LABEL_KEYS } from "@/features/transfers/shared/config/transferMethodCatalog";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const getInitials = (beneficiaryName: string): string => {
  const nameParts = beneficiaryName
    .trim()
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2);

  if (nameParts.length <= 0) {
    return "AC";
  }

  return nameParts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

type Props = {
  item: SendMoneyBeneficiaryItem;
  getLabel: (key: string) => string;
};

export default function SendMoneyBeneficiaryRow(props: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(props.item.beneficiaryName)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{props.item.beneficiaryName}</Text>
        <Text style={styles.meta}>
          {props.item.bankName || props.item.mobileNumber || props.item.accountNumber || "-"}
        </Text>
      </View>

      <Text style={styles.methodText}>
        {props.getLabel(TRANSFER_METHOD_LABEL_KEYS[props.item.transferMethod])}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    paddingVertical: 8,
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "800", color: KhataColors.primaryDark },
  info: { flex: 1 },
  name: { fontSize: 15, color: KhataColors.text, fontWeight: "700" },
  meta: { marginTop: 2, fontSize: 12, color: KhataColors.mutedText },
  methodText: { fontSize: 11, color: KhataColors.primaryDark, fontWeight: "700" },
});
