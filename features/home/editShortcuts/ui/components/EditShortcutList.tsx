import type { EditableHomeShortcut } from "@/features/home/editShortcuts/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import EditShortcutRow from "./EditShortcutRow";

type Props = {
  shortcuts: EditableHomeShortcut[];
  onMoveUpPress(shortcutId: string): void;
  onMoveDownPress(shortcutId: string): void;
  onToggleShortcutPress(shortcutId: string): void;
};

export default function EditShortcutList({
  shortcuts,
  onMoveUpPress,
  onMoveDownPress,
  onToggleShortcutPress,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <KhataCard style={styles.listCard}>
      {shortcuts.length > 0 ? (
        shortcuts.map((shortcut: EditableHomeShortcut, index: number): React.JSX.Element => {
          return (
            <EditShortcutRow
              key={shortcut.id}
              shortcut={shortcut}
              isFirst={index === 0}
              isLast={index === shortcuts.length - 1}
              onMoveUpPress={onMoveUpPress}
              onMoveDownPress={onMoveDownPress}
              onToggleShortcutPress={onToggleShortcutPress}
            />
          );
        })
      ) : (
        <Text style={styles.emptyText}>{t("editShortcuts.empty")}</Text>
      )}
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emptyText: {
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
    paddingVertical: 20,
  },
});
