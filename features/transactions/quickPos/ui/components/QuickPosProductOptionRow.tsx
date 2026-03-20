import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type QuickPosProductOption = {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  stockLabel: string;
};

type Props = {
  product: QuickPosProductOption;
  onPress: () => void;
};

export default function QuickPosProductOptionRow({
  product,
  onPress,
}: Props): React.JSX.Element {
  return (
    <Pressable style={styles.productRow} onPress={onPress}>
      <View style={styles.productMeta}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.productSubtitle} numberOfLines={1}>
          {product.subtitle}
        </Text>
      </View>

      <View style={styles.productAside}>
        <Text style={styles.productPrice}>{product.priceLabel}</Text>
        <Text style={styles.productStock}>{product.stockLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  productRow: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  productMeta: {
    flex: 1,
    gap: 3,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: KhataColors.text,
  },
  productSubtitle: {
    fontSize: 13,
    color: KhataColors.mutedText,
  },
  productAside: {
    alignItems: "flex-end",
    gap: 3,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: KhataColors.primaryDark,
  },
  productStock: {
    fontSize: 12,
    color: KhataColors.mutedText,
  },
});
