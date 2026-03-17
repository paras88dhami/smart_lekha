import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppIcon from "@/shared/components/icons/AppIcon";
import KhataButton from "@/shared/components/ui/KhataButton";
import ScreenContainer from "@/shared/components/ui/ScreenContainer";
import { KhataColors } from "@/shared/theme/colors";
import { OnboardingViewModel } from "@/features/onboarding/onboarding/viewModel/onboarding.viewModel";

type Props = { viewModel: OnboardingViewModel };
export default function OnboardingScreen(props: Props): React.JSX.Element {
  const slide = props.viewModel.slides[props.viewModel.activeIndex];
  const isLast =
    props.viewModel.activeIndex === props.viewModel.slides.length - 1;
  return (
    <ScreenContainer contentStyle={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>Lekha</Text>
        <Text style={styles.language}>🇺🇸 English</Text>
      </View>
      <View style={styles.artArea}>
        <View style={styles.phoneFrame}>
          <AppIcon
            family="ion"
            name={slide.iconName}
            size={96}
            color={KhataColors.primary}
          />
        </View>
      </View>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>
      <View style={styles.buttonRow}>
        <KhataButton
          title="Skip"
          variant="secondary"
          onPress={props.viewModel.skipSlides}
          style={styles.button}
        />
        <KhataButton
          title={isLast ? "Get Started" : "Next"}
          onPress={props.viewModel.nextSlide}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  brand: { fontSize: 24, fontWeight: "800", color: KhataColors.text },
  language: { fontSize: 18, color: KhataColors.text },
  artArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  phoneFrame: {
    width: 290,
    height: 340,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: KhataColors.border,
    backgroundColor: "#FBFAFD",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: KhataColors.text,
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    color: KhataColors.mutedText,
    textAlign: "center",
    marginHorizontal: 12,
  },
  buttonRow: { flexDirection: "row", gap: 14 },
  button: { flex: 1 },
});
