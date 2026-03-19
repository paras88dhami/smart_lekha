import type { MoreViewModel } from "@/features/more/overview/viewModel/more.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: MoreViewModel;
};

export default function MoreScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer contentStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("more.title")}</Text>
          <Text style={styles.subtitle}>{t("more.subtitle")}</Text>
        </View>

        <KhataCard style={styles.menuCard}>
          <Pressable style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <AppIcon family="ion" name="person-circle-outline" size={20} color={KhataColors.primaryDark} />
              <Text style={styles.menuLabel}>{t("more.menu.profile")}</Text>
            </View>
            <AppIcon family="ion" name="chevron-forward" size={16} color={KhataColors.mutedText} />
          </Pressable>

          <Pressable style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <AppIcon family="ion" name="language-outline" size={20} color={KhataColors.primaryDark} />
              <Text style={styles.menuLabel}>{t("more.menu.language")}</Text>
            </View>
            <AppIcon family="ion" name="chevron-forward" size={16} color={KhataColors.mutedText} />
          </Pressable>

          <Pressable style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <AppIcon family="ion" name="help-circle-outline" size={20} color={KhataColors.primaryDark} />
              <Text style={styles.menuLabel}>{t("more.menu.help")}</Text>
            </View>
            <AppIcon family="ion" name="chevron-forward" size={16} color={KhataColors.mutedText} />
          </Pressable>
        </KhataCard>

        {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
          <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
        ) : null}
      </View>

      <KhataButton
        title={t("common.logout")}
        variant="secondary"
        disabled={viewModel.state.status === Status.Loading}
        onPress={(): void => {
          void viewModel.onLogoutPress();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  content: {
    gap: 12,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    fontSize: 13,
    color: KhataColors.mutedText,
    fontWeight: "500",
  },
  menuCard: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  menuRow: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: KhataColors.text,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
  },
});
