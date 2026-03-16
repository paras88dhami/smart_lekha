import React from "react";
import { useRouter } from "expo-router";
import { createOnboardingScreen } from "@/features/onboarding/onboarding/factory/onboardingScreen.factory";
import { useKhataSession } from "@/shared/context/KhataSessionContext";

export default function OnboardingRoute(): React.JSX.Element {
  const router = useRouter();
  const { state, completeOnboarding } = useKhataSession();
  const Screen = React.useMemo(() => createOnboardingScreen({ database: state.database, onFinished: () => { completeOnboarding(); router.push("/(auth)/phone-auth"); } }), [completeOnboarding, router, state.database]);
  return <Screen />;
}
