import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { KhataColors } from "@/shared/theme/colors";
import { LanguageSelectionViewModel } from "@/features/auth/languageSelection/viewModel/languageSelection.viewModel";
import ELekhaLogo from "@/shared/components/icons/ELekhaIcon";

type Props = { viewModel: LanguageSelectionViewModel };
export default function LanguageSelectionScreen(
  props: Props,
): React.JSX.Element {
  return (
    <ScreenContainer contentStyle={styles.container}>
      <View>
        <ELekhaLogo />
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>
          You can change it later from settings
        </Text>
        <View style={styles.list}>
          {props.viewModel.languages.map((item) => {
            const isSelected = item.id === props.viewModel.selectedLanguageId;
            return (
              <Pressable
                key={item.id}
                onPress={() => props.viewModel.selectLanguage(item.id)}
              >
                <KhataCard
                  style={[styles.card, isSelected ? styles.selectedCard : null]}
                >
                  <View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.nativeTitle}</Text>
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
        onPress={props.viewModel.continueFlow}
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
  list: { gap: 18, marginTop: 28 },
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
  cardTitle: { fontSize: 22, fontWeight: "800", color: KhataColors.text },
  cardSubtitle: { marginTop: 8, fontSize: 18, color: KhataColors.mutedText },
  button: { marginBottom: 8 },
});
