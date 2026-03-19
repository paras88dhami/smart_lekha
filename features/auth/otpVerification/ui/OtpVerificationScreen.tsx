import type { OtpVerificationViewModel } from "@/features/auth/otpVerification/viewModel/otpVerification.viewModel";
import { maskPhoneNumber } from "@/features/auth/shared/phoneNumber";
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
  viewModel: OtpVerificationViewModel;
};

export default function OtpVerificationScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const maskedPhone = maskPhoneNumber(
    viewModel.state.countryCode,
    viewModel.state.phoneNumber,
  );
  const canResend = viewModel.state.secondsUntilResend === 0;
  const resendLabel = canResend
    ? t("auth.otpVerification.resend")
    : `${t("auth.otpVerification.resendInPrefix")} ${viewModel.state.secondsUntilResend}s`;

  return (
    <ScreenContainer contentStyle={styles.container}>
      <Pressable onPress={viewModel.onClosePress}>
        <AppIcon family="ion" name="close" size={34} color={KhataColors.text} />
      </Pressable>

      <View>
        <Text style={styles.title}>{t("auth.otpVerification.title")}</Text>
        <Text style={styles.subtitle}>
          {t("auth.otpVerification.subtitle")} {maskedPhone}
        </Text>

        <Text style={styles.codeLabel}>{t("auth.otpVerification.codeLabel")}</Text>
        <KhataCard style={styles.inputCard}>
          <TextInput
            value={viewModel.state.otpCode}
            onChangeText={viewModel.onOtpCodeChange}
            placeholder={t("auth.otpVerification.codePlaceholder")}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />
        </KhataCard>

        {viewModel.state.status === Status.Failure &&
        viewModel.state.errorMessage ? (
          <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
        ) : null}

        <KhataButton
          title={t("auth.otpVerification.verifyButton")}
          disabled={
            viewModel.state.status === Status.Loading ||
            viewModel.state.otpCode.length < 6
          }
          onPress={(): void => {
            void viewModel.onVerifyPress();
          }}
          style={styles.verifyButton}
        />

        <Pressable
          onPress={(): void => {
            void viewModel.onResendPress();
          }}
          disabled={!canResend || viewModel.state.status === Status.Loading}
          style={styles.resendButton}
        >
          <Text
            style={[
              styles.resendText,
              !canResend || viewModel.state.status === Status.Loading
                ? styles.resendDisabledText
                : null,
            ]}
          >
            {resendLabel}
          </Text>
        </Pressable>
      </View>
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
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
    lineHeight: 28,
    color: KhataColors.mutedText,
  },
  codeLabel: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 14,
    color: KhataColors.mutedText,
  },
  inputCard: {
    minHeight: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    fontSize: 28,
    letterSpacing: 8,
    fontWeight: "700",
    color: KhataColors.text,
  },
  errorText: {
    marginTop: 10,
    color: KhataColors.error,
    fontSize: 14,
  },
  verifyButton: {
    marginTop: 18,
  },
  resendButton: {
    marginTop: 16,
    alignItems: "center",
  },
  resendText: {
    fontSize: 16,
    color: KhataColors.primaryDark,
    fontWeight: "700",
  },
  resendDisabledText: {
    color: KhataColors.mutedText,
  },
});
