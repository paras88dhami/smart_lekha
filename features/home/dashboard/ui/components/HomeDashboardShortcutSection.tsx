import type { HomeDashboardShortcut } from "@/features/home/dashboard/types/types";
import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataCard from "@/shared/components/ui/KhataCard";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  shortcuts: HomeDashboardShortcut[];
  onShortcutPress(shortcutKey: HomeShortcutKey): void;
  onEditShortcutsPress(): void;
};

export default function HomeDashboardShortcutSection({
  shortcuts,
  onShortcutPress,
  onEditShortcutsPress,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{t("home.shortcuts.title")}</Text>

        <Pressable onPress={onEditShortcutsPress}>
          <Text style={styles.editText}>{t("common.edit")}</Text>
        </Pressable>
      </View>

      <View style={styles.shortcutGrid}>
        {shortcuts.map((shortcut: HomeDashboardShortcut): React.JSX.Element => {
          return (
            <Pressable
              key={shortcut.key}
              style={styles.shortcutItem}
              onPress={(): void => {
                onShortcutPress(shortcut.key);
              }}
            >
              <KhataCard style={styles.shortcutCard}>
                <View style={styles.shortcutIconBubble}>
                  <AppIcon
                    family="ion"
                    name={shortcut.iconName}
                    size={20}
                    color={KhataColors.primaryDark}
                  />
                </View>
                <Text style={styles.shortcutLabel}>{t(shortcut.labelKey)}</Text>
              </KhataCard>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    color: KhataColors.text,
    fontWeight: "800",
  },
  editText: {
    fontSize: 14,
    color: KhataColors.primary,
    fontWeight: "700",
  },
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  shortcutItem: {
    width: "31.5%",
  },
  shortcutCard: {
    minHeight: 106,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  shortcutIconBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutLabel: {
    textAlign: "center",
    fontSize: 13,
    color: KhataColors.text,
    fontWeight: "700",
  },
});
