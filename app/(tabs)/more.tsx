import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "@/shared/i18n/resources";

export default function MoreRoute(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t("tabs.more")}</Text>
    </View>
  );
}
