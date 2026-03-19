import type { CreateBusinessViewModel } from "@/features/profile/createBusiness/viewModel/createBusiness.viewModel";
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
  viewModel: CreateBusinessViewModel;
};

export default function CreateBusinessScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  const selectedCategory = viewModel.state.categories.find(
    (category) => category.id === viewModel.state.selectedCategoryId,
  );
  const normalizedSearchTerm = viewModel.state.categorySearchTerm.trim().toLowerCase();
  const filteredCategories =
    normalizedSearchTerm.length === 0
      ? viewModel.state.categories
      : viewModel.state.categories.filter((category) =>
          category.name.toLowerCase().includes(normalizedSearchTerm),
        );

  const isCreateDisabled =
    viewModel.state.status === Status.Loading ||
    viewModel.state.isCategoriesLoading ||
    viewModel.state.businessNameInput.trim().length < 2 ||
    !viewModel.state.selectedCategoryId;

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View>
        <Text style={styles.title}>{t("profile.createBusiness.title")}</Text>
        <Text style={styles.subtitle}>{t("profile.createBusiness.subtitle")}</Text>
      </View>

      <Text style={styles.inputLabel}>{t("profile.createBusiness.businessNameLabel")}</Text>
      <KhataCard style={styles.inputCard}>
        <TextInput
          value={viewModel.state.businessNameInput}
          onChangeText={viewModel.onBusinessNameChange}
          placeholder={t("profile.createBusiness.businessNamePlaceholder")}
          style={styles.input}
        />
      </KhataCard>

      <Text style={styles.inputLabel}>{t("profile.createBusiness.categoryLabel")}</Text>
      <KhataCard style={styles.dropdownTriggerCard}>
        <Pressable
          style={styles.dropdownTrigger}
          onPress={viewModel.onCategoryDropdownPress}
          disabled={viewModel.state.isCategoriesLoading}
        >
          <Text
            style={
              selectedCategory
                ? styles.dropdownTriggerValue
                : styles.dropdownTriggerPlaceholder
            }
          >
            {selectedCategory
              ? selectedCategory.name
              : t("profile.createBusiness.categoryPlaceholder")}
          </Text>
          <AppIcon
            family="ion"
            name={
              viewModel.state.isCategoryDropdownOpen ? "chevron-up" : "chevron-down"
            }
            size={18}
            color={KhataColors.mutedText}
          />
        </Pressable>
      </KhataCard>

      {viewModel.state.isCategoriesLoading ? (
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      ) : null}

      {viewModel.state.isCategoryDropdownOpen ? (
        <KhataCard style={styles.dropdownCard}>
          <TextInput
            value={viewModel.state.categorySearchTerm}
            onChangeText={viewModel.onCategorySearchChange}
            placeholder={t("profile.createBusiness.categorySearchPlaceholder")}
            style={styles.dropdownSearchInput}
          />

          <ScrollView
            style={styles.dropdownResults}
            contentContainerStyle={styles.dropdownResultsContent}
            nestedScrollEnabled
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const isSelected = category.id === viewModel.state.selectedCategoryId;

                return (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.dropdownItem,
                      isSelected ? styles.dropdownItemSelected : null,
                    ]}
                    onPress={(): void => {
                      viewModel.onCategoryPress(category.id);
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
                {t("profile.createBusiness.categoryNoResult")}
              </Text>
            )}
          </ScrollView>
        </KhataCard>
      ) : null}

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}

      <KhataButton
        title={t("profile.createBusiness.createButton")}
        disabled={isCreateDisabled}
        onPress={(): void => {
          void viewModel.onCreateBusinessPress();
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
  inputLabel: {
    marginTop: 6,
    marginBottom: -2,
    fontSize: 14,
    color: KhataColors.mutedText,
    fontWeight: "600",
  },
  inputCard: {
    borderRadius: 14,
    minHeight: 60,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 16,
    color: KhataColors.text,
  },
  dropdownTriggerCard: {
    borderRadius: 14,
    minHeight: 56,
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
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  dropdownCard: {
    borderRadius: 14,
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
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
