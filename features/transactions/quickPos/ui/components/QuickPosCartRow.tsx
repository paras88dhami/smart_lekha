import type { QuickPosCartItem } from "@/features/transactions/quickPos/viewModel/quickPos.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import { formatCurrencyAmount } from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./QuickPosSummaryPanel.styles";

type Props = {
  item: QuickPosCartItem;
  languageCode: SupportedLanguageCode;
  onIncreaseItemPress: (itemId: string) => void;
  onDecreaseItemPress: (itemId: string) => void;
};

export default function QuickPosCartRow({
  item,
  languageCode,
  onIncreaseItemPress,
  onDecreaseItemPress,
}: Props): React.JSX.Element {
  return (
    <View style={styles.cartRow}>
      <View style={styles.cartMeta}>
        <Text style={styles.cartName} numberOfLines={1}>
          {item.itemName}
        </Text>

        <Text style={styles.cartPrice}>
          {formatCurrencyAmount({
            amount: item.lineTotal,
            currencyCode: "NPR",
            languageCode,
          })}
        </Text>
      </View>

      <View style={styles.stepper}>
        <Pressable
          style={styles.stepperButton}
          onPress={(): void => {
            onDecreaseItemPress(item.itemId);
          }}
        >
          <AppIcon family="ion" name="remove-outline" size={16} color={KhataColors.text} />
        </Pressable>

        <Text style={styles.stepperValue}>{String(item.quantity)}</Text>

        <Pressable
          style={styles.stepperButton}
          onPress={(): void => {
            onIncreaseItemPress(item.itemId);
          }}
        >
          <AppIcon family="ion" name="add-outline" size={16} color={KhataColors.text} />
        </Pressable>
      </View>
    </View>
  );
}
