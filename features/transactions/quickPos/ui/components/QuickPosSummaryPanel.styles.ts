import { KhataColors } from "@/shared/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  panel: {
    borderRadius: 24,
    padding: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerMeta: {
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    fontSize: 13,
    color: KhataColors.mutedText,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    minHeight: 38,
    borderRadius: 14,
    backgroundColor: "#FFF3F5",
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: KhataColors.error,
  },
  cartList: {
    maxHeight: 150,
  },
  cartListContent: {
    gap: 10,
    paddingRight: 2,
  },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 18,
    backgroundColor: KhataColors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cartMeta: {
    flex: 1,
    gap: 2,
  },
  cartName: {
    fontSize: 15,
    fontWeight: "700",
    color: KhataColors.text,
  },
  cartPrice: {
    fontSize: 13,
    color: KhataColors.mutedText,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
  },
  stepperValue: {
    minWidth: 20,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    color: KhataColors.text,
  },
  emptyState: {
    minHeight: 84,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: KhataColors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  summaryBlock: {
    borderTopWidth: 1,
    borderTopColor: KhataColors.border,
    paddingTop: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: KhataColors.text,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: KhataColors.border,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: KhataColors.text,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: "900",
    color: KhataColors.primaryDark,
  },
  paymentRow: {
    flexDirection: "row",
    gap: 10,
  },
  paymentButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.background,
  },
  paymentButtonActive: {
    borderColor: KhataColors.primaryDark,
    backgroundColor: KhataColors.softGreen,
  },
  paymentButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: KhataColors.text,
  },
  paymentButtonTextActive: {
    color: KhataColors.primaryDark,
  },
  payButton: {
    minHeight: 52,
    borderRadius: 18,
  },
});
