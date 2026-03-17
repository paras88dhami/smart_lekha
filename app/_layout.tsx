import React from "react";
import { Stack } from "expo-router";
import { KhataSessionProvider } from "@/shared/context/KhataSessionContext";

export default function RootLayout(): React.JSX.Element {
  return (
    <KhataSessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </KhataSessionProvider>
  );
}
