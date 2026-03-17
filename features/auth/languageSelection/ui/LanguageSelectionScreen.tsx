import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import type { LanguageCodeType } from "@/features/auth/languageSelection/types/types";
import type { LanguageSelectionViewModel } from "@/features/auth/languageSelection/viewModel/languageSelection.viewModel";
import { useTranslation } from "@/shared/i18n/resources";

type Props = {
  viewModel: LanguageSelectionViewModel;
};

type LanguageOptionTestIdMap = Record<LanguageCodeType, string>;

const LANGUAGE_OPTION_TEST_IDS: LanguageOptionTestIdMap = {
  en: "language-option-en",
  ne: "language-option-ne",
  hi: "language-option-hi",
};

export default function LanguageSelectionScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer contentStyle={styles.container}>
      <View>
        <Text style={styles.brand}>{t("common.appName")}</Text>

        <Text style={styles.title}>
          {t("auth.languageSelection.title")}
        </Text>

        <Text style={styles.subtitle}>
          {t("auth.languageSelection.subtitle")}
        </Text>

        {viewModel.state.status === Status.Failure ? (
          <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
        ) : null}

        <View style={styles.list}>
          {viewModel.state.options.map((option) => {
            const isSelected =
              option.code === viewModel.state.selectedLanguageCode;

            return (
              <Pressable
                key={option.code}
                testID={LANGUAGE_OPTION_TEST_IDS[option.code]}
                onPress={(): void => viewModel.onLanguagePress(option.code)}
              >
                <KhataCard
                  style={[styles.card, isSelected ? styles.selectedCard : null]}
                >
                  <View>
                    <Text style={styles.cardTitle}>{option.title}</Text>
                    <Text style={styles.cardSubtitle}>
                      {option.nativeTitle}
                    </Text>
                  </View>

                  {isSelected ? (
                    <AppIcon
                      family="ion"
                      name="checkmark-circle"
                      size={28}
                      color={KhataColors.primary}
                    />
                  ) : null}
                </KhataCard>
              </Pressable>
            );
          })}
        </View>
      </View>

      <KhataButton
        title={t("common.continue")}
        onPress={(): void => {
          void viewModel.onContinuePress();
        }}
        style={styles.button}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingTop: 14,
    paddingBottom: 16,
  },
  brand: {
    fontSize: 24,
    fontWeight: "800",
    color: KhataColors.text,
    marginTop: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
    marginTop: 28,
  },
  subtitle: {
    fontSize: 18,
    color: KhataColors.mutedText,
    lineHeight: 28,
    marginTop: 8,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#D32F2F",
  },
  list: {
    gap: 18,
    marginTop: 28,
  },
  card: {
    minHeight: 110,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCard: {
    backgroundColor: KhataColors.softGreen,
    borderColor: KhataColors.primary,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: KhataColors.text,
  },
  cardSubtitle: {
    marginTop: 8,
    fontSize: 18,
    color: KhataColors.mutedText,
  },
  button: {
    marginBottom: 8,
  },
});