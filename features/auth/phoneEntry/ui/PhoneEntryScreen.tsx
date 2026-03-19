import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { LANGUAGE_OPTIONS } from "@/features/auth/languageSelection/viewModel/languageOptions";
import { PhoneEntryViewModel } from "@/features/auth/phoneEntry/viewModel/phoneEntry.viewModel";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";

type Props = { viewModel: PhoneEntryViewModel };

export default function PhoneEntryScreen(props: Props): React.JSX.Element {
  const { t } = useTranslation();

  const selectedCountry = props.viewModel.state.countries.find(
    (country) => country.iso === props.viewModel.state.selectedCountryIso,
  );

  return (
    <ScreenContainer contentStyle={styles.container}>
      <Pressable onPress={props.viewModel.closeFlow}>
        <AppIcon family="ion" name="close" size={34} color={KhataColors.text} />
      </Pressable>

      <View>
        <Text style={styles.title}>{t("auth.phoneEntry.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.phoneEntry.subtitle")}</Text>

        <Text style={styles.sectionLabel}>{t("auth.phoneEntry.countryLabel")}</Text>
        <View style={styles.optionRow}>
          {props.viewModel.state.countries.map((country) => {
            const isSelected =
              country.iso === props.viewModel.state.selectedCountryIso;

            return (
              <Pressable
                key={country.iso}
                style={styles.optionItem}
                onPress={(): void => props.viewModel.selectCountry(country.iso)}
              >
                <KhataCard
                  style={[styles.optionCard, isSelected ? styles.selectedCard : null]}
                >
                  <Text style={styles.optionTitle}>{country.flag}</Text>
                  <Text style={styles.optionSubtitle}>
                    {country.name} ({country.callingCode})
                  </Text>
                </KhataCard>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t("auth.phoneEntry.languageLabel")}</Text>
        <View style={styles.optionRow}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected =
              option.code === props.viewModel.state.selectedLanguageCode;

            return (
              <Pressable
                key={option.code}
                style={styles.optionItem}
                onPress={(): void => props.viewModel.selectLanguage(option.code)}
              >
                <KhataCard
                  style={[styles.optionCard, isSelected ? styles.selectedCard : null]}
                >
                  <Text style={styles.optionTitle}>{option.nativeTitle}</Text>
                  <Text style={styles.optionSubtitle}>{option.title}</Text>
                </KhataCard>
              </Pressable>
            );
          })}
        </View>

        <KhataCard style={styles.inputCard}>
          <Text style={styles.prefix}>
            {selectedCountry?.flag ?? "🇳🇵"} {selectedCountry?.callingCode ?? "+977"}
          </Text>
          <TextInput
            value={props.viewModel.state.phoneNumber}
            onChangeText={props.viewModel.changePhoneNumber}
            placeholder={t("auth.phoneEntry.placeholder")}
            keyboardType="number-pad"
            style={styles.input}
          />
        </KhataCard>

        {props.viewModel.state.status === Status.Failure &&
        props.viewModel.state.errorMessage ? (
          <Text style={styles.errorText}>{props.viewModel.state.errorMessage}</Text>
        ) : null}

        <KhataButton
          title={t("common.continue")}
          disabled={
            props.viewModel.state.status === Status.Loading ||
            props.viewModel.state.phoneNumber.length < 10
          }
          onPress={(): void => {
            void props.viewModel.continueFlow();
          }}
          style={styles.button}
        />
      </View>

      <Text style={styles.footer}>{t("auth.phoneEntry.footer")}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: KhataColors.mutedText,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    color: KhataColors.mutedText,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  optionItem: {
    flex: 1,
  },
  optionCard: {
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
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
    fontSize: 13,
    color: KhataColors.mutedText,
    marginTop: 4,
  },
  inputCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  prefix: { fontSize: 18, fontWeight: "700", color: KhataColors.text },
  input: { flex: 1, fontSize: 18, color: KhataColors.text },
  errorText: {
    marginTop: 10,
    color: KhataColors.error,
    fontSize: 14,
  },
  button: { marginTop: 20 },
  footer: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 26,
    color: KhataColors.mutedText,
  },
});
