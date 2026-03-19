import type { ProfileSelectionViewModel } from "@/features/profile/profileSelection/viewModel/profileSelection.viewModel";
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
  viewModel: ProfileSelectionViewModel;
};

const getProfileTypeLabelKey = (profileType: "business" | "personal"): string => {
  return profileType === "business"
    ? "auth.selectProfile.businessTitle"
    : "auth.selectProfile.personalTitle";
};

export default function ProfileSelectionScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  const isActivateDisabled =
    viewModel.state.status === Status.Loading || !viewModel.state.selectedProfileId;

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View>
        <Text style={styles.title}>{t("profile.profileSelection.title")}</Text>
        <Text style={styles.subtitle}>{t("profile.profileSelection.subtitle")}</Text>
      </View>

      <Text style={styles.accountText}>{viewModel.state.accountId}</Text>

      <KhataCard style={styles.listCard}>
        {viewModel.state.profiles.length > 0 ? (
          viewModel.state.profiles.map((profile) => {
            const isSelected = profile.id === viewModel.state.selectedProfileId;
            const displayName = profile.displayName || profile.profileName;
            const profileTypeLabel = t(getProfileTypeLabelKey(profile.profileType));
            const subtitle = profile.businessCategoryName
              ? `${profileTypeLabel} • ${profile.businessCategoryName}`
              : profileTypeLabel;

            return (
              <Pressable
                key={profile.id}
                style={[styles.profileRow, isSelected ? styles.profileRowSelected : null]}
                onPress={(): void => {
                  viewModel.onSelectProfilePress(profile.id);
                }}
              >
                <View style={styles.profileRowLeft}>
                  <Text style={styles.profileName}>{displayName}</Text>
                  <Text style={styles.profileMeta}>{subtitle}</Text>
                </View>

                <View style={styles.profileRowRight}>
                  {profile.isActive ? (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>{t("profile.profileSelection.active")}</Text>
                    </View>
                  ) : null}

                  {isSelected ? (
                    <AppIcon
                      family="ion"
                      name="checkmark-circle"
                      size={22}
                      color={KhataColors.primary}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t("profile.profileSelection.empty")}</Text>
        )}
      </KhataCard>

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}

      <KhataButton
        title={t("profile.profileSelection.activateButton")}
        disabled={isActivateDisabled}
        onPress={(): void => {
          void viewModel.onActivateProfilePress();
        }}
      />

      <KhataButton
        title={t("profile.profileSelection.createBusinessButton")}
        variant="secondary"
        onPress={viewModel.onCreateBusinessPress}
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
  accountText: {
    fontSize: 13,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  profileRow: {
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 8,
  },
  profileRowSelected: {
    backgroundColor: KhataColors.softGreen,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  profileRowLeft: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  profileMeta: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  profileRowRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  activeBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: KhataColors.background,
    borderWidth: 1,
    borderColor: KhataColors.border,
  },
  activeBadgeText: {
    fontSize: 10,
    color: KhataColors.primaryDark,
    fontWeight: "700",
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
