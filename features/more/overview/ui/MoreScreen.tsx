import type { MoreFeatureItem, MoreViewModel } from "@/features/more/overview/viewModel/more.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: MoreViewModel;
};

const getGroupedFeatures = (features: MoreFeatureItem[]) => {
  const implemented = features.filter((item) => item.status === "implemented");
  const pending = features.filter((item) => item.status === "placeholder");

  return {
    implemented,
    pending,
  };
};

export default function MoreScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  const grouped = React.useMemo(
    () => getGroupedFeatures(viewModel.state.features),
    [viewModel.state.features],
  );

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("more.title")}</Text>
        <Text style={styles.subtitle}>{t("more.subtitle")}</Text>
      </View>

      <View style={styles.countRow}>
        <KhataCard style={styles.countCard}>
          <Text style={styles.countValue}>{String(grouped.implemented.length)}</Text>
          <Text style={styles.countLabel}>{t("more.sections.implemented")}</Text>
        </KhataCard>

        <KhataCard style={styles.countCard}>
          <Text style={styles.countValue}>{String(grouped.pending.length)}</Text>
          <Text style={styles.countLabel}>{t("more.sections.pending")}</Text>
        </KhataCard>
      </View>

      <Text style={styles.sectionTitle}>{t("more.sections.implemented")}</Text>
      <KhataCard style={styles.listCard}>
        {grouped.implemented.map((feature) => (
          <Pressable
            key={feature.id}
            style={styles.row}
            onPress={(): void => {
              viewModel.onFeaturePress(feature.id);
            }}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{feature.title}</Text>
              <Text style={styles.rowSubtitle}>{feature.description}</Text>
            </View>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>{t("more.status.live")}</Text>
            </View>
          </Pressable>
        ))}
      </KhataCard>

      <Text style={styles.sectionTitle}>{t("more.sections.pending")}</Text>
      <KhataCard style={styles.listCard}>
        {grouped.pending.map((feature) => (
          <View key={feature.id} style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{feature.title}</Text>
              <Text style={styles.rowSubtitle}>{feature.description}</Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{t("more.status.pending")}</Text>
            </View>
          </View>
        ))}
      </KhataCard>

      {viewModel.state.status === Status.Failure && viewModel.state.errorMessage ? (
        <Text style={styles.errorText}>{viewModel.state.errorMessage}</Text>
      ) : null}

      <KhataButton
        title={t("common.logout")}
        variant="secondary"
        disabled={viewModel.state.status === Status.Loading}
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
  header: {
    gap: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: KhataColors.text,
  },
  subtitle: {
    fontSize: 13,
    color: KhataColors.mutedText,
    fontWeight: "500",
  },
  countRow: {
    flexDirection: "row",
    gap: 10,
  },
  countCard: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  countValue: {
    fontSize: 24,
    color: KhataColors.primaryDark,
    fontWeight: "800",
  },
  countLabel: {
    marginTop: 2,
    fontSize: 13,
    color: KhataColors.mutedText,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: KhataColors.text,
  },
  listCard: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  row: {
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rowLeft: {
    flex: 1,
    paddingVertical: 8,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: KhataColors.text,
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: KhataColors.mutedText,
  },
  liveBadge: {
    backgroundColor: KhataColors.softGreen,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: KhataColors.primaryDark,
  },
  pendingBadge: {
    backgroundColor: KhataColors.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: KhataColors.border,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: KhataColors.mutedText,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
  },
});
