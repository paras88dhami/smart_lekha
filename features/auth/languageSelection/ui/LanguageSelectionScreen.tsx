import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Status } from "@/shared/types/status.types";
import type { LanguageSelectionViewModel } from "../viewModel/languageSelection.viewModel";
import { LANGUAGE_SELECTION_TEST_IDS } from "./testIds";

type LanguageSelectionScreenProps = {
  viewModel: LanguageSelectionViewModel;
};

export default function LanguageSelectionScreen({
  viewModel,
}: LanguageSelectionScreenProps) {
  return (
    <View testID={LANGUAGE_SELECTION_TEST_IDS.SCREEN} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Language</Text>

        <Text style={styles.subtitle}>
          Choose the language you want to use in the app.
        </Text>

        {viewModel.state.status === Status.Failure && (
          <Text
            testID={LANGUAGE_SELECTION_TEST_IDS.ERROR}
            style={styles.errorText}
          >
            {viewModel.state.error}
          </Text>
        )}

        {viewModel.state.options.map((option) => {
          const isSelected =
            option.code === viewModel.state.selectedLanguageCode;

          return (
            <Pressable
              key={option.code}
              onPress={() => viewModel.selectLanguage(option.code)}
              style={[
                styles.card,
                isSelected ? styles.selectedCard : styles.unselectedCard,
              ]}
            >
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        testID={LANGUAGE_SELECTION_TEST_IDS.CONTINUE_BUTTON}
        onPress={() => {
          void viewModel.continueToNextStep();
        }}
        style={styles.continueButton}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 24,
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
  },
  selectedCard: {
    borderColor: "#2563EB",
  },
  unselectedCard: {
    borderColor: "#D1D5DB",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
