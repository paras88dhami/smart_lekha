import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { KhataColors } from "@/shared/theme/colors";
import type { LanguageSelectionViewModel } from "@/features/auth/languageSelection/viewModel/languageSelection.viewModel";
import type { LanguageCodeType } from "@/features/auth/languageSelection/types/types";

type Props = {
  viewModel: LanguageSelectionViewModel;
};

type LanguageCardData = {
  key: string;
  code: LanguageCodeType;
  title: string;
  subtitle: string;
};

function toLanguageCardData(option: unknown): LanguageCardData {
  const item = option as Record<string, unknown>;

  const code = (
    item.code ??
    item.id ??
    item.value ??
    item.languageCode
  ) as LanguageCodeType;

  const title = String(
    item.title ??
      item.label ??
      item.name ??
      item.displayName ??
      code ??
      "",
  );

  const subtitle = String(
    item.nativeTitle ??
      item.subtitle ??
      item.nativeLabel ??
      item.description ??
      "",
  );

  return {
    key: String(code ?? title),
    code,
    title,
    subtitle,
  };
}

export default function LanguageSelectionScreen({
  viewModel,
}: Props): React.JSX.Element {
  return (
    <ScreenContainer contentStyle={styles.container}>
      <View>
        <Text style={styles.brand}>Karobar</Text>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>
          You can change it later from settings
        </Text>

        <View style={styles.list}>
          {viewModel.state.options.map((option) => {
            const item = toLanguageCardData(option);
            const isSelected =
              item.code === viewModel.state.selectedLanguageCode;

            return (
              <Pressable
                key={item.key}
                onPress={() => viewModel.selectLanguage(item.code)}
              >
                <KhataCard
                  style={[styles.card, isSelected ? styles.selectedCard : null]}
                >
                  <View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {item.subtitle ? (
                      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                    ) : null}
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
        title="Continue"
        onPress={() => {
          void viewModel.continueToNextStep();
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