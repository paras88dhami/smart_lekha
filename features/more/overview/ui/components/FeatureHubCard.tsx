import type { FeatureHubItem, FeatureHubModule } from "@/features/more/overview/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataCard from "@/shared/components/ui/KhataCard";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  feature: FeatureHubItem;
  onPress(featureId: string): void;
};

const FEATURE_ICON_MAP: Record<FeatureHubModule, string> = {
  auth: "language-outline",
  cashBank: "wallet-outline",
  home: "home-outline",
  notifications: "notifications-outline",
  parties: "people-outline",
  pos: "grid-outline",
  profile: "person-circle-outline",
  reports: "bar-chart-outline",
  transactions: "swap-horizontal-outline",
  transfers: "paper-plane-outline",
};

export default function FeatureHubCard(props: Props): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed ? styles.pressablePressed : null,
      ]}
      onPress={(): void => {
        props.onPress(props.feature.id);
      }}
    >
      <KhataCard style={styles.card}>
        <View style={styles.content}>
          <View style={styles.iconBubble}>
            <AppIcon
              family="ion"
              name={FEATURE_ICON_MAP[props.feature.module]}
              size={20}
              color={KhataColors.primaryDark}
            />
          </View>

          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={1}>
              {props.feature.title}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {props.feature.description}
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
  );
}

const styles = StyleSheet.create({
  pressable: { width: "100%" },
  pressablePressed: { opacity: 0.9 },
  card: { minHeight: 96, borderRadius: 18, padding: 14 },
  content: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  title: { fontSize: 16, fontWeight: "800", color: KhataColors.text, lineHeight: 20 },
  description: {
    marginTop: 3,
    fontSize: 13,
    color: KhataColors.mutedText,
    lineHeight: 17,
  },
});
