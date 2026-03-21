import type { HomeDashboardAccountOverview } from "@/features/home/dashboard/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataCard from "@/shared/components/ui/KhataCard";
import {
  formatCurrencyAmount,
  useTranslation,
} from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  greeting: string;
  profileName: string;
  accountOverview: HomeDashboardAccountOverview;
  onNotificationsPress(): void;
  onProfilePress(): void;
};

const getProfileInitials = (profileName: string): string => {
  const nameParts = profileName
    .trim()
    .split(" ")
    .filter((namePart: string): boolean => {
      return namePart.length > 0;
    })
    .slice(0, 2);

  if (nameParts.length <= 0) {
    return "EL";
  }

  return nameParts.map((namePart: string): string => namePart[0].toUpperCase()).join("");
};

export default function HomeDashboardHeroSection({
  greeting,
  profileName,
  accountOverview,
  onNotificationsPress,
  onProfilePress,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <View style={styles.heroCard}>
      <View style={styles.heroTopRow}>
        <View style={styles.heroTextArea}>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.profileNameText}>{profileName}</Text>
        </View>

        <View style={styles.heroActions}>
          <Pressable onPress={onNotificationsPress} style={styles.heroActionButton}>
            <AppIcon family="ion" name="notifications-outline" size={20} color={KhataColors.surface} />
          </Pressable>

          <Pressable onPress={onProfilePress} style={styles.avatarButton}>
            <Text style={styles.avatarText}>{getProfileInitials(profileName)}</Text>
          </Pressable>
        </View>
      </View>

      <KhataCard style={styles.accountCard}>
        <Text style={styles.accountNameText}>{t("home.account.totalBalance")}</Text>
        {accountOverview.accountCount > 0 ? (
          <Text style={styles.accountNumberText}>
            {`${accountOverview.accountCount} ${t("home.account.accountsLabel")}`}
          </Text>
        ) : null}
        <Text style={styles.balanceText}>
          {formatCurrencyAmount({
            amount: accountOverview.totalBalance,
            currencyCode: accountOverview.currencyCode,
            languageCode,
          })}
        </Text>
      </KhataCard>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 18,
    backgroundColor: KhataColors.primaryDark,
    padding: 14,
    gap: 12,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  heroTextArea: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  profileNameText: {
    marginTop: 2,
    fontSize: 24,
    color: KhataColors.surface,
    fontWeight: "800",
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "800",
    color: KhataColors.surface,
  },
  accountCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  accountNameText: {
    fontSize: 16,
    color: KhataColors.text,
    fontWeight: "700",
  },
  accountNumberText: {
    marginTop: 2,
    fontSize: 13,
    color: KhataColors.mutedText,
    fontWeight: "500",
  },
  balanceText: {
    marginTop: 12,
    fontSize: 28,
    color: KhataColors.primaryDark,
    fontWeight: "800",
  },
});
