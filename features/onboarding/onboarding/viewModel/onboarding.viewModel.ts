export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  iconName: string;
};
export type OnboardingViewModel = {
  slides: OnboardingSlide[];
  activeIndex: number;
  nextSlide: () => void;
  skipSlides: () => void;
};
