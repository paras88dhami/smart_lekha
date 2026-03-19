import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";

const tabMap: Record<string, { labelKey: string; iconName: string }> = {
  transactions: { labelKey: "tabs.transactions", iconName: "cash-outline" },
  parties: { labelKey: "tabs.parties", iconName: "people-outline" },
  home: { labelKey: "tabs.home", iconName: "home-outline" },
  inventory: { labelKey: "tabs.inventory", iconName: "archive-outline" },
  more: { labelKey: "tabs.more", iconName: "grid-outline" },
};

export default function KhataBottomTabBar(
  props: BottomTabBarProps,
): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {props.state.routes.map((route, index) => {
        const config = tabMap[route.name];

        if (!config) {
          return null;
        }

        const isFocused = props.state.index === index;
        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={() => props.navigation.navigate(route.name)}
          >
            <View
              style={[
                styles.indicator,
                isFocused ? styles.activeIndicator : null,
              ]}
            />
            <AppIcon
              family="ion"
              name={config.iconName}
              size={24}
              color={isFocused ? KhataColors.primary : KhataColors.mutedText}
            />
            <Text style={[styles.label, isFocused ? styles.activeLabel : null]}>
              {t(config.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    backgroundColor: KhataColors.surface,
    borderTopWidth: 1,
    borderTopColor: KhataColors.border,
    height: 86,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  indicator: {
    position: "absolute",
    top: 0,
    width: "56%",
    height: 4,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  activeIndicator: { backgroundColor: KhataColors.primary },
  label: { fontSize: 13, fontWeight: "600", color: KhataColors.mutedText },
  activeLabel: { color: KhataColors.primary },
});
