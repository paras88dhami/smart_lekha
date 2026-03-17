import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import { KhataColors } from "@/shared/theme/colors";

const tabMap: Record<string, { label: string; iconName: string }> = {
  transactions: { label: "Transactions", iconName: "cash-outline" },
  parties: { label: "Parties", iconName: "people-outline" },
  home: { label: "Home", iconName: "home-outline" },
  inventory: { label: "Inventory", iconName: "archive-outline" },
  more: { label: "More", iconName: "grid-outline" },
};

export default function KhataBottomTabBar(
  props: BottomTabBarProps,
): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      {props.state.routes.map((route, index) => {
        const config = tabMap[route.name];
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
              {config.label}
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
