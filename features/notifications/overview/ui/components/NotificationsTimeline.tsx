import type { NotificationTimelineItem } from "@/features/notifications/overview/types/types";
import KhataCard from "@/shared/components/ui/KhataCard";
import type { SupportedLanguageCode } from "@/shared/i18n/resources/types";
import { KhataColors } from "@/shared/theme/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import NotificationTimelineRow from "./NotificationTimelineRow";

type Props = {
  items: NotificationTimelineItem[];
  emptyLabel: string;
  languageCode: SupportedLanguageCode;
};

export default function NotificationsTimeline(props: Props): React.JSX.Element {
  return (
    <KhataCard style={styles.card}>
      {props.items.length > 0 ? (
        props.items.map((item) => (
          <NotificationTimelineRow key={item.id} item={item} languageCode={props.languageCode} />
        ))
      ) : (
        <Text style={styles.emptyText}>{props.emptyLabel}</Text>
      )}
    </KhataCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  emptyText: { textAlign: "center", color: KhataColors.mutedText, fontSize: 14, paddingVertical: 20 },
});
