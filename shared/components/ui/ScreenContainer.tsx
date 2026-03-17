import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { KhataColors } from "@/shared/theme/colors";

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function ScreenContainer(props: Props): React.JSX.Element {
  if (props.scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, props.contentStyle]}
        >
          {props.children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, props.contentStyle]}>{props.children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: KhataColors.background },
  content: { flex: 1, backgroundColor: KhataColors.background },
  scrollContent: { paddingBottom: 28, backgroundColor: KhataColors.background },
});
