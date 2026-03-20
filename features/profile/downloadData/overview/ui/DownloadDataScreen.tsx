import type { DownloadDataViewModel } from "@/features/profile/downloadData/overview/viewModel/downloadData.viewModel";
import DownloadDataHeader from "@/features/profile/downloadData/overview/ui/components/DownloadDataHeader";
import DownloadDataPreviewCard from "@/features/profile/downloadData/overview/ui/components/DownloadDataPreviewCard";
import DownloadDataSummaryCard from "@/features/profile/downloadData/overview/ui/components/DownloadDataSummaryCard";
import KhataButton from "@/shared/components/ui/KhataButton";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatDateTime, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: DownloadDataViewModel;
};

export default function DownloadDataScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  const generatedAtLabel = viewModel.state.generatedAt
    ? `${t("profile.downloadData.generatedAt")}: ${formatDateTime({
        timestamp: viewModel.state.generatedAt,
        languageCode,
      })}`
    : "";

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <DownloadDataHeader
        title={t("profile.downloadData.title")}
        subtitle={t("profile.downloadData.subtitle")}
        profileName={viewModel.state.profileName}
        generatedAtLabel={generatedAtLabel}
      />

      <DownloadDataSummaryCard
        summary={viewModel.state.summary}
        labels={{
          accounts: t("profile.downloadData.summary.accounts"),
          transactions: t("profile.downloadData.summary.transactions"),
          beneficiaries: t("profile.downloadData.summary.beneficiaries"),
          savedTransfers: t("profile.downloadData.summary.savedTransfers"),
          scheduledTransfers: t("profile.downloadData.summary.scheduledTransfers"),
          posItems: t("profile.downloadData.summary.posItems"),
          posSales: t("profile.downloadData.summary.posSales"),
        }}
      />

      <KhataButton
        title={t("profile.downloadData.generateButton")}
        disabled={viewModel.state.status === Status.Loading}
        onPress={(): void => {
          void viewModel.onGeneratePress();
        }}
      />

      <DownloadDataPreviewCard
        jsonPreview={viewModel.state.jsonPreview}
        emptyLabel={t("profile.downloadData.empty")}
      />

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },
  errorText: { color: KhataColors.error, fontSize: 14, fontWeight: "600" },
});
