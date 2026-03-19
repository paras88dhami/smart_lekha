import type { QuickPosViewModel } from "@/features/transactions/quickPos/viewModel/quickPos.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatCurrencyAmount, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: QuickPosViewModel;
};

export default function QuickPosScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextArea}>
          <Text style={styles.title}>{t("quickPos.title")}</Text>
          <Text style={styles.subtitle}>{t("quickPos.subtitle")}</Text>
        </View>
      </View>

      <View style={styles.paymentModeRow}>
        <Pressable
          style={[
            styles.paymentModeButton,
            viewModel.state.paymentMode === "cash" ? styles.paymentModeActive : null,
          ]}
          onPress={(): void => {
            viewModel.onPaymentModePress("cash");
          }}
        >
          <Text style={styles.paymentModeText}>{t("quickPos.cash")}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.paymentModeButton,
            viewModel.state.paymentMode === "bank" ? styles.paymentModeActive : null,
          ]}
          onPress={(): void => {
            viewModel.onPaymentModePress("bank");
          }}
        >
          <Text style={styles.paymentModeText}>{t("quickPos.bank")}</Text>
        </Pressable>
      </View>

      <KhataCard style={styles.itemsCard}>
        {viewModel.state.items.map((item) => {
          const cartItem = viewModel.state.cart.find((cart) => cart.itemId === item.id);
          const quantity = cartItem?.quantity ?? 0;

          return (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemPrice}>
                  {formatCurrencyAmount({
                    amount: item.unitPrice,
                    currencyCode: "NPR",
                    languageCode,
                  })}
                </Text>
              </View>

              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.qtyButton}
                  onPress={(): void => {
                    viewModel.onDecreaseItemPress(item.id);
                  }}
                >
                  <AppIcon family="ion" name="remove" size={14} color={KhataColors.text} />
                </Pressable>

                <Text style={styles.qtyValue}>{String(quantity)}</Text>

                <Pressable
                  style={styles.qtyButton}
                  onPress={(): void => {
                    viewModel.onIncreaseItemPress(item.id);
                  }}
                >
                  <AppIcon family="ion" name="add" size={14} color={KhataColors.text} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </KhataCard>

      <KhataCard style={styles.cartCard}>
        <Text style={styles.cartTitle}>{t("quickPos.cartTitle")}</Text>

        {viewModel.state.cart.length > 0 ? (
          viewModel.state.cart.map((item) => (
            <View key={item.itemId} style={styles.cartRow}>
              <Text style={styles.cartRowTitle}>{`${item.itemName} x${item.quantity}`}</Text>
              <Text style={styles.cartRowTotal}>
                {formatCurrencyAmount({
                  amount: item.lineTotal,
                  currencyCode: "NPR",
                  languageCode,
                })}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCartText}>{t("quickPos.emptyCart")}</Text>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t("quickPos.total")}</Text>
          <Text style={styles.totalValue}>
            {formatCurrencyAmount({
              amount: viewModel.state.totalAmount,
              currencyCode: "NPR",
              languageCode,
            })}
          </Text>
        </View>

        <KhataButton
          title={t("quickPos.checkout")}
          disabled={
            viewModel.state.status === Status.Loading || viewModel.state.totalAmount <= 0
          }
          onPress={(): void => {
            void viewModel.onCheckoutPress();
          }}
        />
      </KhataCard>

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  headerTextArea: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    color: KhataColors.text,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: KhataColors.mutedText,
  },
  paymentModeRow: {
    flexDirection: "row",
    gap: 8,
  },
  paymentModeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KhataColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentModeActive: {
    backgroundColor: KhataColors.softGreen,
    borderColor: KhataColors.primaryDark,
  },
  paymentModeText: {
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "700",
  },
  itemsCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  itemRow: {
    minHeight: 52,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemMeta: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  itemPrice: {
    fontSize: 13,
    color: KhataColors.mutedText,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KhataColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    minWidth: 20,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: KhataColors.text,
  },
  cartCard: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  cartTitle: {
    fontSize: 18,
    color: KhataColors.text,
    fontWeight: "800",
  },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartRowTitle: {
    flex: 1,
    fontSize: 14,
    color: KhataColors.text,
  },
  cartRowTotal: {
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "700",
  },
  emptyCartText: {
    fontSize: 13,
    color: KhataColors.mutedText,
  },
  totalRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: KhataColors.border,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 17,
    color: KhataColors.text,
    fontWeight: "800",
  },
  errorText: {
    fontSize: 14,
    color: KhataColors.error,
    fontWeight: "600",
  },
});
