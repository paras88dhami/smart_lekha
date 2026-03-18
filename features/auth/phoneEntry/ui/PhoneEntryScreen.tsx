import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { KhataColors } from "@/shared/theme/colors";
import { PhoneEntryViewModel } from "@/features/auth/phoneEntry/viewModel/phoneEntry.viewModel";
import { useTranslation } from "@/shared/i18n/resources";

type Props = { viewModel: PhoneEntryViewModel };

export default function PhoneEntryScreen(props: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer contentStyle={styles.container}>
      <Pressable onPress={props.viewModel.closeFlow}>
        <AppIcon family="ion" name="close" size={34} color={KhataColors.text} />
      </Pressable>

      <View>
        <Text style={styles.title}>{t("auth.phoneEntry.title")}</Text>

        <Text style={styles.subtitle}>{t("auth.phoneEntry.subtitle")}</Text>

        <KhataCard style={styles.inputCard}>
          <Text style={styles.prefix}>🇳🇵 +977</Text>
          <TextInput
            value={props.viewModel.phoneNumber}
            onChangeText={props.viewModel.changePhoneNumber}
            placeholder={t("auth.phoneEntry.placeholder")}
            keyboardType="number-pad"
            style={styles.input}
          />
        </KhataCard>

        <KhataButton
          title={t("common.continue")}
          disabled={props.viewModel.phoneNumber.length < 10}
          onPress={props.viewModel.continueFlow}
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
  inputCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  prefix: { fontSize: 18, fontWeight: "700", color: KhataColors.text },
  input: { flex: 1, fontSize: 18, color: KhataColors.text },
  button: { marginTop: 20 },
  footer: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 26,
    color: KhataColors.mutedText,
  },
});
