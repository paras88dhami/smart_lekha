import type { ProfileTypeSelectionViewModel } from "@/features/auth/profileTypeSelection/viewModel/profileTypeSelection.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: ProfileTypeSelectionViewModel;
};

export default function ProfileTypeSelectionScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t } = useTranslation();
  const isBusinessSelected = viewModel.state.selectedProfileType === "business";
  const selectedBusinessCategory = viewModel.state.businessCategories.find(
    (category) => category.id === viewModel.state.selectedBusinessCategoryId,
  );
  const normalizedSearchTerm =
    viewModel.state.businessCategorySearchTerm.trim().toLowerCase();
  const filteredBusinessCategories =
    normalizedSearchTerm.length === 0
      ? viewModel.state.businessCategories
      : viewModel.state.businessCategories.filter((category) =>
          category.name.toLowerCase().includes(normalizedSearchTerm),
        );
  const isContinueDisabled =
    viewModel.state.status === Status.Loading ||
    viewModel.state.profileName.trim().length < 2 ||
    (isBusinessSelected &&
      (viewModel.state.isBusinessCategoriesLoading ||
        !viewModel.state.selectedBusinessCategoryId));

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <Pressable onPress={viewModel.onClosePress}>
        <AppIcon family="ion" name="close" size={34} color={KhataColors.text} />
      </Pressable>

      <View>
        <Text style={styles.title}>{t("auth.selectProfile.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.selectProfile.subtitle")}</Text>

        <View style={styles.optionsContainer}>
          {viewModel.state.options.map((option) => {
            const isSelected =
              option.profileType === viewModel.state.selectedProfileType;

            return (
              <Pressable
                key={option.profileType}
                onPress={(): void => {
                  viewModel.onProfileTypePress(option.profileType);
                }}
              >
                <KhataCard
                  style={[styles.optionCard, isSelected ? styles.selectedCard : null]}
                >
                  <Text style={styles.optionTitle}>{t(option.titleKey)}</Text>
                  <Text style={styles.optionSubtitle}>{t(option.subtitleKey)}</Text>
                </KhataCard>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.inputLabel}>{t("auth.selectProfile.nameLabel")}</Text>
        <KhataCard style={styles.inputCard}>
          <TextInput
            value={viewModel.state.profileName}
            onChangeText={viewModel.onProfileNameChange}
            placeholder={t("auth.selectProfile.namePlaceholder")}
            style={styles.input}
          />
        </KhataCard>

        {isBusinessSelected ? (
          <>
            <Text style={styles.inputLabel}>{t("auth.selectProfile.categoryLabel")}</Text>
            <KhataCard style={styles.dropdownTriggerCard}>
              <Pressable
                style={styles.dropdownTrigger}
                onPress={viewModel.onBusinessCategoryDropdownPress}
                disabled={viewModel.state.isBusinessCategoriesLoading}
              >
                <Text
                  style={
                    selectedBusinessCategory
                      ? styles.dropdownTriggerValue
                      : styles.dropdownTriggerPlaceholder
                  }
                >
                  {selectedBusinessCategory
                    ? selectedBusinessCategory.name
                    : t("auth.selectProfile.categoryPlaceholder")}
                </Text>
                <AppIcon
                  family="ion"
                  name={
                    viewModel.state.isBusinessCategoryDropdownOpen
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={18}
                  color={KhataColors.mutedText}
                />
              </Pressable>
            </KhataCard>

            {viewModel.state.isBusinessCategoriesLoading ? (
              <Text style={styles.loadingText}>{t("common.loading")}</Text>
            ) : null}

            {viewModel.state.isBusinessCategoryDropdownOpen ? (
              <KhataCard style={styles.dropdownCard}>
                <TextInput
                  value={viewModel.state.businessCategorySearchTerm}
                  onChangeText={viewModel.onBusinessCategorySearchChange}
                  placeholder={t("auth.selectProfile.categorySearchPlaceholder")}
                  style={styles.dropdownSearchInput}
                />
                <ScrollView
                  style={styles.dropdownResults}
                  contentContainerStyle={styles.dropdownResultsContent}
                  nestedScrollEnabled
                >
                  {filteredBusinessCategories.length > 0 ? (
                    filteredBusinessCategories.map((category) => {
                      const isSelected =
                        category.id === viewModel.state.selectedBusinessCategoryId;

                      return (
                        <Pressable
                          key={category.id}
                          style={[
                            styles.dropdownItem,
                            isSelected ? styles.dropdownItemSelected : null,
                          ]}
                          onPress={(): void => {
                            viewModel.onBusinessCategoryPress(category.id);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{category.name}</Text>
                          {isSelected ? (
                            <AppIcon
                              family="ion"
                              name="checkmark"
                              size={18}
                              color={KhataColors.primary}
                            />
                          ) : null}
                        </Pressable>
                      );
                    })
                  ) : (
                    <Text style={styles.dropdownEmptyText}>
                      {t("auth.selectProfile.categoryNoResult")}
                    </Text>
                  )}
                </ScrollView>
              </KhataCard>
            ) : null}
          </>
        ) : null}

        {viewModel.state.status === Status.Failure &&
        viewModel.state.errorMessage ? (
          <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
        ) : null}

        <KhataButton
          title={t("common.continue")}
          disabled={isContinueDisabled}
          onPress={(): void => {
            void viewModel.onContinuePress();
          }}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
    lineHeight: 28,
    color: KhataColors.mutedText,
  },
  optionsContainer: {
    gap: 12,
    marginTop: 22,
  },
  optionCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  selectedCard: {
    backgroundColor: KhataColors.softGreen,
    borderColor: KhataColors.primary,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: KhataColors.text,
  },
  optionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  inputLabel: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  inputCard: {
    borderRadius: 16,
    minHeight: 64,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  input: {
    fontSize: 17,
    color: KhataColors.text,
  },
  dropdownTriggerCard: {
    borderRadius: 16,
    minHeight: 58,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  dropdownTrigger: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dropdownTriggerValue: {
    flex: 1,
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "600",
  },
  dropdownTriggerPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: KhataColors.mutedText,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  dropdownCard: {
    marginTop: 10,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dropdownSearchInput: {
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: KhataColors.background,
    paddingHorizontal: 10,
    color: KhataColors.text,
    fontSize: 15,
  },
  dropdownResults: {
    maxHeight: 220,
    marginTop: 10,
  },
  dropdownResultsContent: {
    gap: 6,
    paddingBottom: 2,
  },
  dropdownItem: {
    borderRadius: 12,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: KhataColors.background,
    gap: 10,
  },
  dropdownItemSelected: {
    backgroundColor: KhataColors.softGreen,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 14,
    color: KhataColors.text,
  },
  dropdownEmptyText: {
    fontSize: 14,
    color: KhataColors.mutedText,
    textAlign: "center",
    paddingVertical: 14,
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: KhataColors.error,
  },
  button: {
    marginTop: 18,
  },
});
