import type { EditableHomeShortcut } from "@/features/home/editShortcuts/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type Props = {
  shortcut: EditableHomeShortcut;
  isFirst: boolean;
  isLast: boolean;
  onMoveUpPress(shortcutId: string): void;
  onMoveDownPress(shortcutId: string): void;
  onToggleShortcutPress(shortcutId: string): void;
};

export default function EditShortcutRow({
  shortcut,
  isFirst,
  isLast,
  onMoveUpPress,
  onMoveDownPress,
  onToggleShortcutPress,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.rowItem}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowTitle}>{t(shortcut.labelKey)}</Text>
        <Text style={styles.rowSubtitle}>{`#${String(shortcut.sortOrder)}`}</Text>
      </View>

      <View style={styles.rowActions}>
        <Pressable
          style={[styles.reorderButton, isFirst ? styles.disabledAction : null]}
          disabled={isFirst}
          onPress={(): void => {
            onMoveUpPress(shortcut.id);
          }}
        >
          <AppIcon family="ion" name="chevron-up" size={16} color={KhataColors.text} />
        </Pressable>

        <Pressable
          style={[styles.reorderButton, isLast ? styles.disabledAction : null]}
          disabled={isLast}
          onPress={(): void => {
            onMoveDownPress(shortcut.id);
          }}
        >
          <AppIcon family="ion" name="chevron-down" size={16} color={KhataColors.text} />
        </Pressable>

        <Switch
          value={shortcut.isEnabled}
          onValueChange={(): void => {
            onToggleShortcutPress(shortcut.id);
          }}
          trackColor={{
            false: KhataColors.border,
            true: KhataColors.primary,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowItem: {
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowLeft: {
    flex: 1,
    paddingVertical: 8,
  },
  rowTitle: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  rowActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reorderButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: KhataColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledAction: {
    opacity: 0.35,
  },
});
