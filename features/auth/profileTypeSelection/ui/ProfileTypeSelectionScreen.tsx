import type { ProfileTypeSelectionViewModel } from "@/features/auth/profileTypeSelection/viewModel/profileTypeSelection.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  viewModel: ProfileTypeSelectionViewModel;
};

export default function ProfileTypeSelectionScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t } = useTranslation();
  const isBusinessSelected =
    viewModel.state.selectedProfileType === "business";
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
            {viewModel.state.isBusinessCategoriesLoading ? (
              <Text style={styles.loadingText}>{t("common.loading")}</Text>
            ) : (
              <View style={styles.categoriesContainer}>
                {viewModel.state.businessCategories.map((category) => {
                  const isSelected =
                    category.id === viewModel.state.selectedBusinessCategoryId;

                  return (
                    <Pressable
                      key={category.id}
                      style={styles.categoryItem}
                      onPress={(): void => {
                        viewModel.onBusinessCategoryPress(category.id);
                      }}
                    >
                      <KhataCard
                        style={[
                          styles.categoryCard,
                          isSelected ? styles.selectedCard : null,
                        ]}
                      >
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                      </KhataCard>
                    </Pressable>
                  );
                })}
              </View>
            )}
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
  loadingText: {
    marginTop: 2,
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  categoriesContainer: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryItem: {
    width: "48%",
  },
  categoryCard: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    minHeight: 68,
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: 13,
    lineHeight: 19,
    color: KhataColors.text,
    fontWeight: "600",
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
