import type { HomeDashboardViewModel } from "@/features/home/dashboard/viewModel/homeDashboard.viewModel";
import HomeDashboardHeroSection from "@/features/home/dashboard/ui/components/HomeDashboardHeroSection";
import HomeDashboardRecentActivitySection from "@/features/home/dashboard/ui/components/HomeDashboardRecentActivitySection";
import HomeDashboardShortcutSection from "@/features/home/dashboard/ui/components/HomeDashboardShortcutSection";
import HomeDashboardSummarySection from "@/features/home/dashboard/ui/components/HomeDashboardSummarySection";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  viewModel: HomeDashboardViewModel;
};

export default function HomeDashboardScreen({ viewModel }: Props): React.JSX.Element {
  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <HomeDashboardHeroSection
        greeting={viewModel.state.greeting}
        profileName={viewModel.state.profileName}
        accountOverview={viewModel.state.accountOverview}
        onNotificationsPress={viewModel.onNotificationsPress}
        onProfilePress={viewModel.onProfilePress}
      />

      <HomeDashboardSummarySection
        flowSummary={viewModel.state.flowSummary}
        paymentSummary={viewModel.state.paymentSummary}
        currencyCode={viewModel.state.accountOverview.currencyCode}
      />

      <HomeDashboardShortcutSection
        shortcuts={viewModel.state.shortcuts}
        onShortcutPress={viewModel.onShortcutPress}
        onEditShortcutsPress={viewModel.onEditShortcutsPress}
      />

      <HomeDashboardRecentActivitySection
        recentActivity={viewModel.state.recentActivity}
        currencyCode={viewModel.state.accountOverview.currencyCode}
        onViewAllTransactionsPress={viewModel.onViewAllTransactionsPress}
      />

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
  errorText: {
    fontSize: 14,
    color: KhataColors.error,
    fontWeight: "600",
  },
});
