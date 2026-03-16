import React from "react";
import { Stack } from "expo-router";
import { KhataSessionProvider } from "@/shared/context/KhataSessionContext";

export default function RootLayout(): React.JSX.Element {
  return (
    <KhataSessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="switch-profile" />
        <Stack.Screen name="edit-shortcuts" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="cash-bank" />
        <Stack.Screen name="quick-entry" />
        <Stack.Screen name="quick-pos" />
      </Stack>
    </KhataSessionProvider>
  );
}
