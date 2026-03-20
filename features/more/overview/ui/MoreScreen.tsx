import type { MoreViewModel } from "@/features/more/overview/viewModel/more.viewModel";
import FeatureHubList from "@/features/more/overview/ui/components/FeatureHubList";
import MoreHeader from "@/features/more/overview/ui/components/MoreHeader";
import MoreLogoutSection from "@/features/more/overview/ui/components/MoreLogoutSection";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: MoreViewModel;
};

export default function MoreScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <MoreHeader title={t("more.title")} subtitle={t("more.subtitle")} />

      <FeatureHubList
        features={viewModel.state.features}
        onFeaturePress={viewModel.onFeaturePress}
      />

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}

      <MoreLogoutSection
        title={t("common.logout")}
        disabled={viewModel.state.isLoggingOut}
        onPress={(): void => {
          void viewModel.onLogoutPress();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 12,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
