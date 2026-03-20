import type { NotificationsViewModel } from "@/features/notifications/overview/viewModel/notifications.viewModel";
import NotificationsHeader from "@/features/notifications/overview/ui/components/NotificationsHeader";
import NotificationsTimeline from "@/features/notifications/overview/ui/components/NotificationsTimeline";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: NotificationsViewModel;
};

export default function NotificationsScreen({ viewModel }: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <NotificationsHeader
        title={t("notifications.title")}
        subtitle={t("notifications.subtitle")}
      />

      <NotificationsTimeline
        items={viewModel.state.notifications}
        emptyLabel={t("notifications.empty")}
        languageCode={languageCode}
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
