import { KhataColors } from "@/shared/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(18, 20, 26, 0.34)",
  },
  sheet: {
    maxHeight: "88%",
    minHeight: "74%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: KhataColors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerMeta: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    fontSize: 13,
    color: KhataColors.mutedText,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: KhataColors.background,
  },
  searchShell: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.background,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    color: KhataColors.text,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    gap: 18,
    paddingBottom: 8,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: KhataColors.mutedText,
    textTransform: "uppercase",
  },
  sectionMeta: {
    fontSize: 12,
    fontWeight: "800",
    color: KhataColors.mutedText,
  },
  emptyState: {
    minHeight: 90,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: KhataColors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    color: KhataColors.mutedText,
    textAlign: "center",
  },
  createSection: {
    gap: 10,
  },
  createToggle: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: KhataColors.softGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  createToggleText: {
    fontSize: 14,
    fontWeight: "800",
    color: KhataColors.primaryDark,
  },
});
