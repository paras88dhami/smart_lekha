import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "@/shared/i18n/resources";

export default function HomeRoute(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t("tabs.home")}</Text>
    </View>
  );
}
