import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import { useTranslation } from "@/shared/i18n/resources";
import { KhataColors } from "@/shared/theme/colors";

type TabRouteName = "home" | "transactions" | "inventory" | "more";

type TabConfig = {
  labelKey: string;
  iconName: string;
};

const TAB_CONFIG_MAP: Record<TabRouteName, TabConfig> = {
  home: { labelKey: "tabs.home", iconName: "home-outline" },
  transactions: { labelKey: "tabs.transactions", iconName: "receipt-outline" },
  inventory: { labelKey: "tabs.inventory", iconName: "paper-plane-outline" },
  more: { labelKey: "tabs.more", iconName: "menu-outline" },
};

const getTabConfig = (routeName: string): TabConfig | null => {
  if (!(routeName in TAB_CONFIG_MAP)) {
    return null;
  }

  return TAB_CONFIG_MAP[routeName as TabRouteName];
};

export default function KhataBottomTabBar(
  props: BottomTabBarProps,
): React.JSX.Element | null {
  const { t } = useTranslation();

  const focusedRoute = props.state.routes[props.state.index];

  if (focusedRoute?.name === "quick-pos") {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      {props.state.routes.map((route, index) => {
        const config = getTabConfig(route.name);

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
                styles.iconBubble,
                isFocused ? styles.iconBubbleActive : null,
              ]}
            >
              <AppIcon
                family="ion"
                name={config.iconName}
                size={22}
                color={isFocused ? KhataColors.primaryDark : KhataColors.mutedText}
              />
            </View>
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
    minHeight: 84,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubbleActive: {
    backgroundColor: KhataColors.softGreen,
  },
  label: { fontSize: 12, fontWeight: "600", color: KhataColors.mutedText },
  activeLabel: { color: KhataColors.primaryDark },
});
