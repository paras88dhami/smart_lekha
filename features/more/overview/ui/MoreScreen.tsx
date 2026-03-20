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

const FEATURE_ICON_MAP: Record<string, string> = {
  home: "home-outline",
  transactions: "swap-horizontal-outline",
  transfers: "paper-plane-outline",
  pos: "grid-outline",
  cashBank: "wallet-outline",
  notifications: "notifications-outline",
  parties: "people-outline",
  reports: "bar-chart-outline",
  profile: "person-circle-outline",
  auth: "language-outline",
  more: "ellipsis-horizontal-circle-outline",
};

const getFeatureIconName = (feature: MoreFeatureItem): string => {
  return FEATURE_ICON_MAP[feature.module] ?? "apps-outline";
};

export default function MoreScreen({ viewModel }: Props): React.JSX.Element {
  const { t } = useTranslation();

  const visibleFeatures = React.useMemo(
    () =>
      viewModel.state.features.filter((feature) => feature.status === "implemented"),
    [viewModel.state.features],
  );

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("more.title")}</Text>
        <Text style={styles.subtitle}>{t("more.subtitle")}</Text>
      </View>

      <View style={styles.featureGrid}>
        {visibleFeatures.map((feature) => (
          <Pressable
            key={feature.id}
            style={({ pressed }) => [
              styles.featureCardPressable,
              pressed ? styles.featureCardPressablePressed : null,
            ]}
            onPress={(): void => {
              viewModel.onFeaturePress(feature.id);
            }}
          >
            <KhataCard style={styles.featureCard}>
              <View style={styles.featureCardContent}>
                <View style={styles.iconBubble}>
                  <AppIcon
                    family="ion"
                    name={getFeatureIconName(feature)}
                    size={20}
                    color={KhataColors.primaryDark}
                  />
                </View>

                <View style={styles.featureCardBody}>
                  <Text style={styles.featureTitle} numberOfLines={1}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription} numberOfLines={1}>
                    {feature.description}
                  </Text>
                </View>

                <AppIcon
                  family="ion"
                  name="chevron-forward"
                  size={18}
                  color={KhataColors.primaryDark}
                />
              </View>
            </KhataCard>
          </Pressable>
        ))}
      </View>

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
  featureGrid: {
    gap: 10,
  },
  featureCardPressable: {
    width: "100%",
  },
  featureCardPressablePressed: {
    opacity: 0.9,
  },
  featureCard: {
    minHeight: 96,
    borderRadius: 18,
    padding: 14,
  },
  featureCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  featureCardBody: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: KhataColors.text,
    lineHeight: 20,
  },
  featureDescription: {
    marginTop: 3,
    fontSize: 13,
    color: KhataColors.mutedText,
    lineHeight: 17,
  },
  errorText: {
    color: KhataColors.error,
    fontSize: 14,
    fontWeight: "600",
  },
});
