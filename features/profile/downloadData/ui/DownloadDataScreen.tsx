import type { DownloadDataViewModel } from "@/features/profile/downloadData/viewModel/downloadData.viewModel";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatDateTime, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: DownloadDataViewModel;
};

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element => {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
};

export default function DownloadDataScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View>
        <Text style={styles.title}>{t("profile.downloadData.title")}</Text>
        <Text style={styles.subtitle}>{t("profile.downloadData.subtitle")}</Text>
      </View>

      <Text style={styles.profileText}>{viewModel.state.profileName}</Text>

      <KhataCard style={styles.summaryCard}>
        <SummaryRow
          label={t("profile.downloadData.summary.accounts")}
          value={String(viewModel.state.summary.accountsCount)}
        />
        <SummaryRow
          label={t("profile.downloadData.summary.transactions")}
          value={String(viewModel.state.summary.transactionsCount)}
        />
        <SummaryRow
          label={t("profile.downloadData.summary.beneficiaries")}
          value={String(viewModel.state.summary.beneficiariesCount)}
        />
        <SummaryRow
          label={t("profile.downloadData.summary.savedTransfers")}
          value={String(viewModel.state.summary.savedTransfersCount)}
        />
        <SummaryRow
          label={t("profile.downloadData.summary.scheduledTransfers")}
          value={String(viewModel.state.summary.scheduledTransfersCount)}
        />
        <SummaryRow
          label={t("profile.downloadData.summary.posItems")}
          value={String(viewModel.state.summary.posItemsCount)}
        />
        <SummaryRow
          label={t("profile.downloadData.summary.posSales")}
          value={String(viewModel.state.summary.posSalesCount)}
        />
      </KhataCard>

      <KhataButton
        title={t("profile.downloadData.generateButton")}
        disabled={viewModel.state.status === Status.Loading}
        onPress={(): void => {
          void viewModel.onGeneratePress();
        }}
      />

      {viewModel.state.generatedAt ? (
        <Text style={styles.generatedAtText}>
          {`${t("profile.downloadData.generatedAt")}: ${formatDateTime({
            timestamp: viewModel.state.generatedAt,
            languageCode,
          })}`}
        </Text>
      ) : null}

      <KhataCard style={styles.previewCard}>
        {viewModel.state.jsonPreview ? (
          <Text style={styles.previewText}>{viewModel.state.jsonPreview}</Text>
        ) : (
          <Text style={styles.emptyPreviewText}>{t("profile.downloadData.empty")}</Text>
        )}
      </KhataCard>

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
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
  profileText: {
    fontSize: 14,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  summaryCard: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: KhataColors.text,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    color: KhataColors.primaryDark,
    fontWeight: "800",
  },
  generatedAtText: {
    fontSize: 12,
    color: KhataColors.mutedText,
    fontWeight: "600",
  },
  previewCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxHeight: 320,
  },
  previewText: {
    fontSize: 11,
    color: KhataColors.text,
    lineHeight: 16,
  },
  emptyPreviewText: {
    textAlign: "center",
    color: KhataColors.mutedText,
    fontSize: 14,
    paddingVertical: 20,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
