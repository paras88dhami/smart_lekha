import React from "react";
import { Tabs } from "expo-router";
import KhataBottomTabBar from "@/shared/components/ui/KhataBottomTabBar";

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      tabBar={(props) => <KhataBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="inventory" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}
