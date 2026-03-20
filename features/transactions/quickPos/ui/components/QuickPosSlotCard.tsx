import type { PosItem } from "@/features/pos/item/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import { formatCurrencyAmount } from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./QuickPosSlotCard.styles";

type Props = {
  slotId: string;
  item: PosItem | null;
  quantity: number;
  width: number;
  height: number;
  languageCode: SupportedLanguageCode;
  stockLabel: string;
  emptyLabel: string;
  onPress: () => void;
  onActionPress: () => void;
};

const SLOT_ACCENTS = ["#36A9E1", "#5BB7EC", "#2F8CFF", "#55C0A5", "#8B63F6", "#F29A4A"];

const getAccentColor = (value: string): string => {
  const hash = value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return SLOT_ACCENTS[hash % SLOT_ACCENTS.length] ?? SLOT_ACCENTS[0];
};

export default function QuickPosSlotCard({
  slotId,
  item,
  quantity,
  width,
  height,
  languageCode,
  stockLabel,
  emptyLabel,
  onPress,
  onActionPress,
}: Props): React.JSX.Element {
  if (!item) {
    return (
      <Pressable style={[styles.slotCard, styles.slotCardEmpty, { width, height }]} onPress={onPress}>
        <View style={styles.emptySlotInner}>
          <AppIcon family="ion" name="add-outline" size={18} color={KhataColors.primaryDark} />
          <Text style={styles.emptySlotText}>{emptyLabel}</Text>
        </View>
      </Pressable>
    );
  }

  const accentColor = getAccentColor(`${slotId}-${item.itemName}`);
  const isOutOfStock = item.availableStock <= 0;

  return (
    <Pressable
      style={[
        styles.slotCard,
        { width, height, backgroundColor: accentColor },
        isOutOfStock ? styles.slotCardDisabled : null,
      ]}
      onPress={onPress}
    >
      <View style={styles.slotCardHeader}>
        <View style={styles.slotBadge}>
          <Text style={styles.slotBadgeText}>{String(item.availableStock)}</Text>
        </View>

        <Pressable style={styles.slotAction} onPress={onActionPress}>
          <AppIcon family="ion" name="ellipsis-horizontal" size={12} color={KhataColors.surface} />
        </Pressable>
      </View>

      <View style={styles.slotCardBody}>
        <Text style={styles.slotTitle} numberOfLines={2}>
          {item.itemName}
        </Text>

        <Text style={styles.slotPrice}>
          {formatCurrencyAmount({
            amount: item.unitPrice,
            currencyCode: "NPR",
            languageCode,
          })}
        </Text>
      </View>

      <View style={styles.slotCardFooter}>
        <Text style={styles.slotFooterText} numberOfLines={1}>
          {stockLabel}
        </Text>

        {quantity > 0 ? (
          <View style={styles.quantityBubble}>
            <Text style={styles.quantityBubbleText}>{String(quantity)}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
