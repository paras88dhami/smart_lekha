import type { EditShortcutsViewModel } from "@/features/home/editShortcuts/viewModel/editShortcuts.viewModel";
import EditShortcutList from "@/features/home/editShortcuts/ui/components/EditShortcutList";
import KhataButton from "@/shared/components/ui/KhataButton";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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

      <EditShortcutList
        shortcuts={viewModel.state.shortcuts}
        onMoveUpPress={viewModel.onMoveUpPress}
        onMoveDownPress={viewModel.onMoveDownPress}
        onToggleShortcutPress={viewModel.onToggleShortcutPress}
      />

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
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
