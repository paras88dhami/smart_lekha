import type { EditShortcutsViewModel } from "@/features/home/editShortcuts/viewModel/editShortcuts.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type Props = {
  viewModel: EditShortcutsViewModel;
};

export default function EditShortcutsScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View>
        <Text style={styles.title}>{t("editShortcuts.title")}</Text>
        <Text style={styles.subtitle}>{t("editShortcuts.subtitle")}</Text>
      </View>

      <Text style={styles.profileText}>{viewModel.state.profileName}</Text>

      <KhataCard style={styles.listCard}>
        {viewModel.state.shortcuts.length > 0 ? (
          viewModel.state.shortcuts.map((shortcut, index) => {
            const isFirst = index === 0;
            const isLast = index === viewModel.state.shortcuts.length - 1;

            return (
              <View key={shortcut.id} style={styles.rowItem}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowTitle}>{t(shortcut.labelKey)}</Text>
                  <Text style={styles.rowSubtitle}>{`#${String(shortcut.sortOrder)}`}</Text>
                </View>

                <View style={styles.rowActions}>
                  <Pressable
                    style={[styles.reorderButton, isFirst ? styles.disabledAction : null]}
                    disabled={isFirst}
                    onPress={(): void => {
                      viewModel.onMoveUpPress(shortcut.id);
                    }}
                  >
                    <AppIcon family="ion" name="chevron-up" size={16} color={KhataColors.text} />
                  </Pressable>

                  <Pressable
                    style={[styles.reorderButton, isLast ? styles.disabledAction : null]}
                    disabled={isLast}
                    onPress={(): void => {
                      viewModel.onMoveDownPress(shortcut.id);
                    }}
                  >
                    <AppIcon family="ion" name="chevron-down" size={16} color={KhataColors.text} />
                  </Pressable>

                  <Switch
                    value={shortcut.isEnabled}
                    onValueChange={(): void => {
                      viewModel.onToggleShortcutPress(shortcut.id);
                    }}
                    trackColor={{
                      false: KhataColors.border,
                      true: KhataColors.primary,
                    }}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t("editShortcuts.empty")}</Text>
        )}
      </KhataCard>

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}

      <KhataButton
        title={t("common.save")}
        disabled={viewModel.state.status === Status.Loading || !viewModel.state.hasChanges}
        onPress={(): void => {
          void viewModel.onSavePress();
        }}
      />
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
  profileText: {
    fontSize: 14,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
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
  emptyText: {
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
    paddingVertical: 20,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
