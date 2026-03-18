import type { LanguageSelectionViewModel } from "@/features/auth/languageSelection/viewModel/languageSelection.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import ELekhaLogo from "@/shared/components/icons/ELekhaIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: LanguageSelectionViewModel;
};

export default function LanguageSelectionScreen({ viewModel }: Props) {
  const { t } = useTranslation();

  return (
    <ScreenContainer contentStyle={styles.container}>
      <View>
        <ELekhaLogo />
        <Text style={styles.title}>{t("auth.languageSelection.title")}</Text>
        <Text style={styles.subtitle}>
          {t("auth.languageSelection.subtitle")}
        </Text>

        {viewModel.state.status === Status.Failure &&
        viewModel.state.errorMessage ? (
          <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
        ) : null}

        <View style={styles.list}>
          {viewModel.state.options.map((option) => {
            const isSelected =
              option.code === viewModel.state.selectedLanguageCode;

            return (
              <Pressable
                key={option.code}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
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
    color: KhataColors.error,
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
