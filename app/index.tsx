import React from "react";
import { Redirect } from "expo-router";
import { useKhataSession } from "@/shared/context/KhataSessionContext";

export default function IndexScreen(): React.JSX.Element {
  const { state } = useKhataSession();
  if (!state.onboardingComplete) {
    return <Redirect href="/(auth)/language" />;
  }
  return <Redirect href="/(tabs)/home" />;
}
