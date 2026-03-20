import { KhataColors } from "@/shared/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  slotCard: {
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 6,
  },
  slotCardEmpty: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.background,
    justifyContent: "center",
  },
  slotCardDisabled: {
    opacity: 0.72,
  },
  slotCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  slotBadge: {
    minWidth: 24,
    minHeight: 20,
    borderRadius: 999,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  slotBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: KhataColors.surface,
  },
  slotAction: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  slotCardBody: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  slotTitle: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "800",
    color: KhataColors.surface,
  },
  slotPrice: {
    fontSize: 12,
    fontWeight: "900",
    color: KhataColors.surface,
  },
  slotCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  slotFooterText: {
    flex: 1,
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.88)",
  },
  quantityBubble: {
    minWidth: 22,
    minHeight: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    backgroundColor: KhataColors.surface,
  },
  quantityBubbleText: {
    fontSize: 10,
    fontWeight: "900",
    color: KhataColors.primaryDark,
  },
  emptySlotInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  emptySlotText: {
    fontSize: 11,
    fontWeight: "800",
    color: KhataColors.primaryDark,
    textAlign: "center",
  },
});
