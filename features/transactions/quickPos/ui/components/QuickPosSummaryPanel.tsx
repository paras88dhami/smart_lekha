import type {
  QuickPosCartItem,
  QuickPosPaymentMode,
} from "@/features/transactions/quickPos/viewModel/quickPos.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import QuickPosCartRow from "./QuickPosCartRow";
import QuickPosSummaryRow from "./QuickPosSummaryRow";
import { styles } from "./QuickPosSummaryPanel.styles";

type Props = {
  cart: QuickPosCartItem[];
  totalAmount: number;
  paymentMode: QuickPosPaymentMode;
  isCheckingOut: boolean;
  languageCode: SupportedLanguageCode;
  onIncreaseItemPress: (itemId: string) => void;
  onDecreaseItemPress: (itemId: string) => void;
  onPaymentModePress: (mode: QuickPosPaymentMode) => void;
  onClearCartPress: () => void;
  onCheckoutPress: () => void;
};

export default function QuickPosSummaryPanel({
  cart,
  totalAmount,
  paymentMode,
  isCheckingOut,
  languageCode,
  onIncreaseItemPress,
  onDecreaseItemPress,
  onPaymentModePress,
  onClearCartPress,
  onCheckoutPress,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  const totalQuantity = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <KhataCard style={styles.panel}>
      <View style={styles.headerRow}>
        <View style={styles.headerMeta}>
          <Text style={styles.title}>{t("quickPos.cartTitle")}</Text>
          <Text style={styles.subtitle}>{`${totalQuantity} ${t("quickPos.itemsCount")}`}</Text>
        </View>

        <Pressable style={styles.clearButton} onPress={onClearCartPress}>
          <AppIcon family="ion" name="trash-outline" size={16} color={KhataColors.error} />
          <Text style={styles.clearButtonText}>{t("quickPos.clearCart")}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.cartList}
        contentContainerStyle={styles.cartListContent}
        showsVerticalScrollIndicator={false}
      >
        {cart.length > 0 ? (
          cart.map((item) => (
            <QuickPosCartRow
              key={item.itemId}
              item={item}
              languageCode={languageCode}
              onIncreaseItemPress={onIncreaseItemPress}
              onDecreaseItemPress={onDecreaseItemPress}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <AppIcon family="ion" name="cart-outline" size={20} color={KhataColors.mutedText} />
            <Text style={styles.emptyText}>{t("quickPos.emptyCart")}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.summaryBlock}>
        <QuickPosSummaryRow label={t("quickPos.itemsCount")} value={String(totalQuantity)} />
        <QuickPosSummaryRow
          label={t("quickPos.grossAmount")}
          value={formatCurrencyAmount({
            amount: totalAmount,
            currencyCode: "NPR",
            languageCode,
          })}
        />
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t("quickPos.grandTotal")}</Text>
        <Text style={styles.totalValue}>
          {formatCurrencyAmount({
            amount: totalAmount,
            currencyCode: "NPR",
            languageCode,
          })}
        </Text>
      </View>

      <View style={styles.paymentRow}>
        {(["cash", "bank"] as QuickPosPaymentMode[]).map((mode) => (
          <Pressable
            key={mode}
            style={[
              styles.paymentButton,
              paymentMode === mode ? styles.paymentButtonActive : null,
            ]}
            onPress={(): void => {
              onPaymentModePress(mode);
            }}
          >
            <Text
              style={[
                styles.paymentButtonText,
                paymentMode === mode ? styles.paymentButtonTextActive : null,
              ]}
            >
              {mode === "cash" ? t("quickPos.cash") : t("quickPos.bank")}
            </Text>
          </Pressable>
        ))}
      </View>

      <KhataButton
        title={t("quickPos.payNow")}
        disabled={isCheckingOut || totalAmount <= 0}
        onPress={onCheckoutPress}
        style={styles.payButton}
      />
    </KhataCard>
  );
}
