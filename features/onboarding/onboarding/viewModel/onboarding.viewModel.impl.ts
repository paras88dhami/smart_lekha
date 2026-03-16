import React from "react";
import { KhataDatabase } from "@/shared/database/khata.database";
import { OnboardingViewModel } from "./onboarding.viewModel";

type Params = { database: KhataDatabase; onFinished: () => void };
const slides = [
  { id: "mobile", title: "Business on Your Mobile", description: "Manage your business accounting & inventory easily from your mobile at your fingertip.", iconName: "phone-portrait-outline" },
  { id: "reports", title: "Insightful Business Reports", description: "Make better business decisions with your business performance report.", iconName: "bar-chart-outline" },
  { id: "staff", title: "Multi Businesses & Staffs", description: "Create & manage multiple businesses & also your personal finance.", iconName: "people-outline" },
  { id: "offline", title: "Use Both Offline & Online", description: "Run your business anytime seamlessly even without an internet connection.", iconName: "cloud-offline-outline" },
  { id: "secure", title: "Secure & Reliable", description: "Your data is securely stored and backed up which you can recover anytime.", iconName: "shield-checkmark-outline" },
];
export function useOnboardingViewModel(params: Params): OnboardingViewModel {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const nextSlide = React.useCallback(() => { setActiveIndex((current) => { const next = current + 1; if (next >= slides.length) { params.onFinished(); return current; } return next; }); }, [params]);
  const skipSlides = React.useCallback(() => { params.onFinished(); }, [params]);
  return { slides, activeIndex, nextSlide, skipSlides };
}
