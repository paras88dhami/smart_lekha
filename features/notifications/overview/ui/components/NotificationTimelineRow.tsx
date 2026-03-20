import type { NotificationTimelineItem } from "@/features/notifications/overview/types/types";
import AppIcon from "@/shared/components/icons/AppIcon";
import { formatDateTime } from "@/shared/i18n/resources";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  item: NotificationTimelineItem;
  languageCode: SupportedLanguageCode;
};

export default function NotificationTimelineRow(props: Props): React.JSX.Element {
  const iconName =
    props.item.kind === "scheduled_transfer"
      ? "calendar-outline"
      : "notifications-outline";

  return (
    <View style={styles.row}>
      <View style={styles.leadingIcon}>
        <AppIcon family="ion" name={iconName} size={16} color={KhataColors.primaryDark} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{props.item.title}</Text>
        <Text style={styles.description}>{props.item.description}</Text>
        <Text style={styles.timestamp}>
          {formatDateTime({ timestamp: props.item.timestamp, languageCode: props.languageCode })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
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
  content: { flex: 1 },
  title: { fontSize: 15, color: KhataColors.text, fontWeight: "700" },
  description: { marginTop: 2, fontSize: 13, color: KhataColors.text },
  timestamp: { marginTop: 4, fontSize: 11, color: KhataColors.mutedText, fontWeight: "600" },
});
