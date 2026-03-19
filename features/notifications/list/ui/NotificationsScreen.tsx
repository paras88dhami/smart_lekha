import type { NotificationsViewModel } from "@/features/notifications/list/viewModel/notifications.viewModel";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataCard from "@/shared/components/ui/KhataCard";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { formatDateTime, useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";
import { Status } from "@/shared/types/status.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  viewModel: NotificationsViewModel;
};

export default function NotificationsScreen({
  viewModel,
}: Props): React.JSX.Element {
  const { t, languageCode } = useTranslation();

  return (
    <ScreenContainer scrollable contentStyle={styles.container}>
      <View>
        <Text style={styles.title}>{t("notifications.title")}</Text>
        <Text style={styles.subtitle}>{t("notifications.subtitle")}</Text>
      </View>

      <KhataCard style={styles.listCard}>
        {viewModel.state.notifications.length > 0 ? (
          viewModel.state.notifications.map((notification) => {
            const iconName =
              notification.kind === "scheduled_transfer"
                ? "calendar-outline"
                : "notifications-outline";

            return (
              <View key={notification.id} style={styles.rowItem}>
                <View style={styles.leadingIcon}>
                  <AppIcon
                    family="ion"
                    name={iconName}
                    size={16}
                    color={KhataColors.primaryDark}
                  />
                </View>

                <View style={styles.rowContent}>
                  <Text style={styles.rowTitle}>{notification.title}</Text>
                  <Text style={styles.rowDescription}>{notification.description}</Text>
                  <Text style={styles.rowTime}>
                    {formatDateTime({
                      timestamp: notification.timestamp,
                      languageCode,
                    })}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t("notifications.empty")}</Text>
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
  listCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rowItem: {
    minHeight: 66,
    borderBottomWidth: 1,
    borderBottomColor: KhataColors.border,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
  },
  leadingIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: KhataColors.softGreen,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    color: KhataColors.text,
    fontWeight: "700",
  },
  rowDescription: {
    marginTop: 2,
    fontSize: 13,
    color: KhataColors.text,
  },
  rowTime: {
    marginTop: 4,
    fontSize: 11,
    color: KhataColors.mutedText,
    fontWeight: "600",
  },
  emptyText: {
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
